#!/usr/bin/env sh
set -eu

IMAGE="${IMAGE:-ghcr.io/techgardeners/atlarium-mcp}"
TAG="${TAG:-2.0.0}"
PLATFORM="${PLATFORM:-linux/amd64}"
NAMESPACE="${NAMESPACE:-atlarium-mcp}"
KUSTOMIZE_DIR="${KUSTOMIZE_DIR:-deploy/kubernetes}"
PUBLIC_BASE_URL="${PUBLIC_BASE_URL:-https://mcp.atlarium.bio}"
PUSH_IMAGE="${PUSH_IMAGE:-false}"
DEPLOY_KUBERNETES="${DEPLOY_KUBERNETES:-false}"
VALIDATE_PUBLIC="${VALIDATE_PUBLIC:-false}"

run() {
  printf "\n==> %s\n" "$*"
  "$@"
}

run pnpm lint
run pnpm test
run pnpm build
run pnpm audit:prod

if [ "$PUSH_IMAGE" = "true" ]; then
  run docker buildx build --platform "$PLATFORM" -t "$IMAGE:$TAG" --push .
else
  run docker buildx build --platform "$PLATFORM" -t "$IMAGE:$TAG" --load .
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
