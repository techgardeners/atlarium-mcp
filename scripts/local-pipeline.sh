#!/usr/bin/env sh
set -eu

IMAGE="${IMAGE:-ghcr.io/techgardeners/atlarium-mcp}"
PACKAGE_VERSION="$(node -p "require('./package.json').version")"
TAG="${TAG:-$PACKAGE_VERSION}"
PLATFORM="${PLATFORM:-linux/amd64}"
NAMESPACE="${NAMESPACE:-atlarium-mcp}"
KUSTOMIZE_DIR="${KUSTOMIZE_DIR:-deploy/kubernetes}"
PUBLIC_BASE_URL="${PUBLIC_BASE_URL:-https://mcp.atlarium.bio}"
PUSH_IMAGE="${PUSH_IMAGE:-false}"
DEPLOY_KUBERNETES="${DEPLOY_KUBERNETES:-false}"
VALIDATE_PUBLIC="${VALIDATE_PUBLIC:-false}"
DOCKER_BIN="${DOCKER_BIN:-docker}"

run() {
  printf "\n==> %s\n" "$*"
  "$@"
}

if ! "$DOCKER_BIN" info >/dev/null 2>&1; then
  printf "Docker is unavailable. Start Docker Desktop (or set DOCKER_BIN to a compatible running client) and rerun the pipeline.\n" >&2
  exit 1
fi

run pnpm lint
run pnpm test
run pnpm build
run pnpm audit:prod

if [ "$PUSH_IMAGE" = "true" ]; then
  if inspect_output="$("$DOCKER_BIN" buildx imagetools inspect "$IMAGE:$TAG" 2>&1)"; then
    printf "\nRefusing to overwrite immutable image tag %s:%s.\n" "$IMAGE" "$TAG" >&2
    exit 1
  fi
  case "$inspect_output" in
    *"not found"*|*"manifest unknown"*) ;;
    *)
      printf "\nUnable to prove image tag %s:%s is unused:\n%s\n" "$IMAGE" "$TAG" "$inspect_output" >&2
      exit 1
      ;;
  esac
  run "$DOCKER_BIN" buildx build --platform "$PLATFORM" -t "$IMAGE:$TAG" --push .
else
  run "$DOCKER_BIN" buildx build --platform "$PLATFORM" -t "$IMAGE:$TAG" --load .
fi

if [ "$DEPLOY_KUBERNETES" = "true" ]; then
  run kubectl apply -k "$KUSTOMIZE_DIR"
  run kubectl -n "$NAMESPACE" set image deployment/atlarium-mcp atlarium-mcp="$IMAGE:$TAG"
  run kubectl -n "$NAMESPACE" rollout status deployment/atlarium-mcp --timeout=180s
fi

if [ "$VALIDATE_PUBLIC" = "true" ]; then
  run curl -fsS "$PUBLIC_BASE_URL/health"
  run curl -fsS "$PUBLIC_BASE_URL/.well-known/mcp/server-card.json"
  run pnpm mcp:conformance:public
  run pnpm mcp:validate:public
fi
