#!/usr/bin/env sh
set -eu

SSH_HOST="${SSH_HOST:-epk}"
IMAGE="${IMAGE:-ghcr.io/techgardeners/atlarium-mcp}"
TAG="${TAG:-2.0.0}"
NAMESPACE="${NAMESPACE:-atlarium-mcp}"
KUSTOMIZE_DIR="${KUSTOMIZE_DIR:-deploy/kubernetes}"
TLS_SOURCE_NAMESPACE="${TLS_SOURCE_NAMESPACE:-aquarium}"
TLS_SECRET_NAME="${TLS_SECRET_NAME:-atlarium-tls}"
ORIGIN_IP="${ORIGIN_IP:-65.108.0.75}"
PUBLIC_HOST="${PUBLIC_HOST:-mcp.atlarium.bio}"

run() {
  printf "\n==> %s\n" "$*"
  "$@"
}

run ssh "$SSH_HOST" "hostname && kubectl get nodes --no-headers"

printf "\n==> ensure namespace %s\n" "$NAMESPACE"
ssh "$SSH_HOST" "kubectl create namespace '$NAMESPACE' --dry-run=client -o yaml | kubectl apply -f -"

printf "\n==> copy TLS secret %s/%s -> %s/%s\n" "$TLS_SOURCE_NAMESPACE" "$TLS_SECRET_NAME" "$NAMESPACE" "$TLS_SECRET_NAME"
ssh "$SSH_HOST" "kubectl get secret '$TLS_SECRET_NAME' -n '$TLS_SOURCE_NAMESPACE' -o json" \
  | NAMESPACE="$NAMESPACE" node -e '
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
' \
  | ssh "$SSH_HOST" "kubectl apply -f -"

printf "\n==> apply kustomize manifests through %s\n" "$SSH_HOST"
kubectl kustomize "$KUSTOMIZE_DIR" \
  | sed "s|ghcr.io/techgardeners/atlarium-mcp:2.0.0|$IMAGE:$TAG|g" \
  | ssh "$SSH_HOST" "kubectl apply -f -"

run ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' set image deployment/atlarium-mcp atlarium-mcp='$IMAGE:$TAG'"
run ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' rollout restart deployment/atlarium-mcp"
run ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' rollout status deployment/atlarium-mcp --timeout=180s"
run ssh "$SSH_HOST" "kubectl -n '$NAMESPACE' get pods,svc,ingress -o wide"

printf "\n==> validate origin via --resolve %s -> %s\n" "$PUBLIC_HOST" "$ORIGIN_IP"
run curl -kfsS --resolve "$PUBLIC_HOST:443:$ORIGIN_IP" "https://$PUBLIC_HOST/health"
run curl -kfsS --resolve "$PUBLIC_HOST:443:$ORIGIN_IP" "https://$PUBLIC_HOST/.well-known/mcp/server-card.json"
