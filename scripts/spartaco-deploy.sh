#!/usr/bin/env sh
set -eu

SSH_HOST="${SSH_HOST:-spartaco}"
IMAGE="${IMAGE:-ghcr.io/techgardeners/atlarium-mcp}"
PACKAGE_VERSION="$(node -p "require('./package.json').version")"
TAG="${TAG:-$PACKAGE_VERSION}"
NAMESPACE="${NAMESPACE:-atlarium-mcp}"
KUSTOMIZE_DIR="${KUSTOMIZE_DIR:-deploy/kubernetes}"
TLS_SOURCE_NAMESPACE="${TLS_SOURCE_NAMESPACE:-aquarium}"
TLS_SECRET_NAME="${TLS_SECRET_NAME:-atlarium-tls}"
ORIGIN_IP="${ORIGIN_IP:-65.108.0.75}"
PUBLIC_HOST="${PUBLIC_HOST:-mcp.atlarium.bio}"
PREVIOUS_IMAGE=""
PREVIOUS_VERSION=""
PREVIOUS_REVISION=""
ROLLBACK_ARMED=false
DEPLOY_TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/atlarium-mcp-deploy.XXXXXX")"
SOURCE_SECRET="$DEPLOY_TMP_DIR/source-secret.json"
TARGET_SECRET="$DEPLOY_TMP_DIR/target-secret.json"
PREVIOUS_CONFIG_RAW="$DEPLOY_TMP_DIR/previous-config-raw.json"
PREVIOUS_CONFIG="$DEPLOY_TMP_DIR/previous-config.json"
RENDERED_MANIFEST="$DEPLOY_TMP_DIR/rendered.yaml"
FINAL_MANIFEST="$DEPLOY_TMP_DIR/final.yaml"
RESPONSE_JSON="$DEPLOY_TMP_DIR/response.json"
PODS_JSON="$DEPLOY_TMP_DIR/pods.json"

run() {
  printf "\n==> %s\n" "$*"
  "$@"
}

validate_rollback_value() {
  value="$1"
  label="$2"
  case "$value" in
    ""|*[!A-Za-z0-9._/:@+-]*)
      printf "Refusing deploy: unsafe %s value for rollback: %s\n" "$label" "$value" >&2
      exit 1
      ;;
  esac
}

cleanup_temp() {
  rm -f "$SOURCE_SECRET" "$TARGET_SECRET" "$PREVIOUS_CONFIG_RAW" "$PREVIOUS_CONFIG" "$RENDERED_MANIFEST" "$FINAL_MANIFEST" "$RESPONSE_JSON" "$PODS_JSON"
  rmdir "$DEPLOY_TMP_DIR" 2>/dev/null || true
}

json_version() {
  node -e '
const fs = require("node:fs");
const value = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const version = value.version ?? value.server?.version;
if (typeof version !== "string" || !version) process.exit(1);
process.stdout.write(version);
' "$1"
}

verify_version_endpoint() {
  label="$1"
  expected="$2"
  shift 2
  attempt=1
  while [ "$attempt" -le 12 ]; do
    if curl "$@" > "$RESPONSE_JSON"; then
      actual="$(json_version "$RESPONSE_JSON" 2>/dev/null || true)"
      if [ "$actual" = "$expected" ]; then
        printf "==> %s reports version %s\n" "$label" "$actual"
        return 0
      fi
      printf "==> %s reports %s; waiting for %s (attempt %s/12)\n" "$label" "${actual:-invalid JSON}" "$expected" "$attempt" >&2
    else
      printf "==> %s is not ready (attempt %s/12)\n" "$label" "$attempt" >&2
    fi
    attempt=$((attempt + 1))
    sleep 5
  done
  printf "Version check failed for %s: expected %s.\n" "$label" "$expected" >&2
  return 1
}

verify_deployment_state() {
  expected_image="$1"
  current_image="$(ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' get deployment atlarium-mcp -o jsonpath='{.spec.template.spec.containers[?(@.name==\"atlarium-mcp\")].image}'")"
  if [ "$current_image" != "$expected_image" ]; then
    printf "Deployment image mismatch: expected %s, got %s.\n" "$expected_image" "$current_image" >&2
    return 1
  fi
  ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' get pods -l app=atlarium-mcp -o json" > "$PODS_JSON"
  EXPECTED_IMAGE="$expected_image" node -e '
const fs = require("node:fs");
const payload = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const pods = Array.isArray(payload.items) ? payload.items : [];
if (!pods.length) throw new Error("no Atlarium MCP pods found");
for (const pod of pods) {
  const spec = pod.spec?.containers?.find((entry) => entry.name === "atlarium-mcp");
  const status = pod.status?.containerStatuses?.find((entry) => entry.name === "atlarium-mcp");
  if (spec?.image !== process.env.EXPECTED_IMAGE) throw new Error(`unexpected pod image ${spec?.image ?? "missing"}`);
  if (!status?.ready || !status?.imageID) throw new Error(`pod ${pod.metadata?.name ?? "unknown"} is not ready on an immutable image`);
}
process.stdout.write(`==> ${pods.length} ready pod(s) use ${process.env.EXPECTED_IMAGE}\n`);
' "$PODS_JSON"
}

rollback_on_failure() {
  status=$?
  trap - EXIT HUP INT TERM
  if [ "$status" -ne 0 ] && [ "$ROLLBACK_ARMED" = true ]; then
    printf "\n==> deploy failed; rolling back %s to %s (%s)\n" "$NAMESPACE" "$PREVIOUS_IMAGE" "$PREVIOUS_VERSION" >&2
    set +e
    rollback_status=0
    ssh "$SSH_HOST" "kubectl apply -f -" < "$PREVIOUS_CONFIG" || rollback_status=1
    if ! ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' rollout undo deployment/atlarium-mcp --to-revision='$PREVIOUS_REVISION'"; then
      rollback_status=1
      ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' set image deployment/atlarium-mcp atlarium-mcp='$PREVIOUS_IMAGE'" || rollback_status=1
      ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' rollout restart deployment/atlarium-mcp" || rollback_status=1
    fi
    ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' rollout status deployment/atlarium-mcp --timeout=180s" || rollback_status=1
    verify_deployment_state "$PREVIOUS_IMAGE" || rollback_status=1
    verify_version_endpoint "rollback origin health" "$PREVIOUS_VERSION" -kfsS --resolve "$PUBLIC_HOST:443:$ORIGIN_IP" "https://$PUBLIC_HOST/health" || rollback_status=1
    verify_version_endpoint "rollback origin server card" "$PREVIOUS_VERSION" -kfsS --resolve "$PUBLIC_HOST:443:$ORIGIN_IP" "https://$PUBLIC_HOST/.well-known/mcp/server-card.json" || rollback_status=1
    set -e
    if [ "$rollback_status" -ne 0 ]; then
      printf "Rollback did not complete; inspect namespace %s immediately.\n" "$NAMESPACE" >&2
    fi
  fi
  cleanup_temp
  exit "$status"
}

trap rollback_on_failure EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

run ssh "$SSH_HOST" "hostname && kubectl get nodes --no-headers"

printf "\n==> ensure namespace %s\n" "$NAMESPACE"
ssh "$SSH_HOST" "kubectl get namespace '$NAMESPACE' >/dev/null 2>&1 || kubectl create namespace '$NAMESPACE'"

printf "\n==> copy TLS secret %s/%s -> %s/%s\n" "$TLS_SOURCE_NAMESPACE" "$TLS_SECRET_NAME" "$NAMESPACE" "$TLS_SECRET_NAME"
ssh "$SSH_HOST" "kubectl get secret '$TLS_SECRET_NAME' -n '$TLS_SOURCE_NAMESPACE' -o json" > "$SOURCE_SECRET"
NAMESPACE="$NAMESPACE" node -e '
const fs = require("node:fs");
const secret = JSON.parse(fs.readFileSync(0, "utf8"));
const metadata = secret.metadata ?? {};
secret.metadata = {
  name: metadata.name,
  namespace: process.env.NAMESPACE,
};
if (metadata.labels) {
  secret.metadata.labels = metadata.labels;
}
console.log(JSON.stringify(secret));
' < "$SOURCE_SECRET" > "$TARGET_SECRET"
test -s "$TARGET_SECRET"
ssh "$SSH_HOST" "kubectl apply -f -" < "$TARGET_SECRET"

printf "\n==> capture current production release for automatic rollback\n"
PREVIOUS_IMAGE="$(ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' get deployment atlarium-mcp -o jsonpath='{.spec.template.spec.containers[?(@.name==\"atlarium-mcp\")].image}'")"
PREVIOUS_VERSION="$(ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' get configmap atlarium-mcp-config -o jsonpath='{.data.MCP_VERSION}'")"
PREVIOUS_REVISION="$(ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' get deployment atlarium-mcp -o jsonpath='{.metadata.annotations.deployment\\.kubernetes\\.io/revision}'")"
validate_rollback_value "$PREVIOUS_IMAGE" "image"
validate_rollback_value "$PREVIOUS_VERSION" "version"
case "$PREVIOUS_REVISION" in
  ""|*[!0-9]*)
    printf "Refusing deploy: invalid rollback revision %s.\n" "$PREVIOUS_REVISION" >&2
    exit 1
    ;;
esac
ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' get configmap atlarium-mcp-config -o json" \
  > "$PREVIOUS_CONFIG_RAW"
node -e '
const fs = require("node:fs");
const config = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const restored = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    name: config.metadata?.name,
    namespace: config.metadata?.namespace,
    ...(config.metadata?.labels ? { labels: config.metadata.labels } : {}),
  },
  ...(config.data ? { data: config.data } : {}),
  ...(config.binaryData ? { binaryData: config.binaryData } : {}),
  ...(typeof config.immutable === "boolean" ? { immutable: config.immutable } : {}),
};
process.stdout.write(JSON.stringify(restored));
' "$PREVIOUS_CONFIG_RAW" > "$PREVIOUS_CONFIG"
test -s "$PREVIOUS_CONFIG"
ROLLBACK_ARMED=true

printf "\n==> apply kustomize manifests through %s\n" "$SSH_HOST"
kubectl kustomize "$KUSTOMIZE_DIR" > "$RENDERED_MANIFEST"
test -s "$RENDERED_MANIFEST"
sed "s|ghcr.io/techgardeners/atlarium-mcp:$PACKAGE_VERSION|$IMAGE:$TAG|g" \
  "$RENDERED_MANIFEST" > "$FINAL_MANIFEST"
test -s "$FINAL_MANIFEST"
ssh "$SSH_HOST" "kubectl apply -f -" < "$FINAL_MANIFEST"

run ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' set image deployment/atlarium-mcp atlarium-mcp='$IMAGE:$TAG'"
run ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' rollout restart deployment/atlarium-mcp"
run ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' rollout status deployment/atlarium-mcp --timeout=180s"
run ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' get pods,svc,ingress -o wide"

printf "\n==> validate origin via --resolve %s -> %s\n" "$PUBLIC_HOST" "$ORIGIN_IP"
verify_version_endpoint "origin health" "$PACKAGE_VERSION" -kfsS --resolve "$PUBLIC_HOST:443:$ORIGIN_IP" "https://$PUBLIC_HOST/health"
verify_version_endpoint "origin server card" "$PACKAGE_VERSION" -kfsS --resolve "$PUBLIC_HOST:443:$ORIGIN_IP" "https://$PUBLIC_HOST/.well-known/mcp/server-card.json"
verify_deployment_state "$IMAGE:$TAG"

printf "\n==> validate public Cloudflare version\n"
verify_version_endpoint "public health" "$PACKAGE_VERSION" -fsS "https://$PUBLIC_HOST/health"
verify_version_endpoint "public server card" "$PACKAGE_VERSION" -fsS "https://$PUBLIC_HOST/.well-known/mcp/server-card.json"

printf "\n==> validate public Cloudflare and MCP contracts\n"
run pnpm mcp:monitor:public
run pnpm mcp:validate:public
run pnpm mcp:conformance:public

ROLLBACK_ARMED=false
cleanup_temp
trap - EXIT HUP INT TERM

printf "\n==> audit external directory discovery (non-runtime gate)\n"
if ! run pnpm directories:submit -- --check; then
  printf "Directory audit is temporarily unavailable; runtime release remains healthy and is not rolled back.\n" >&2
fi
