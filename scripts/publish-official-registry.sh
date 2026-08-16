#!/usr/bin/env sh
set -eu

REGISTRY_DOMAIN="${MCP_REGISTRY_DOMAIN:-atlarium.bio}"
REGISTRY_KEY_FILE="${MCP_REGISTRY_KEY_FILE:-$HOME/.config/atlarium-mcp/mcp-registry-ed25519.pem}"

if [ ! -f "$REGISTRY_KEY_FILE" ]; then
  printf "Official Registry DNS key is missing at %s. Restore the verified Atlarium key matching the public MCPv1 TXT record, or rotate the DNS proof before publishing.\n" "$REGISTRY_KEY_FILE" >&2
  exit 1
fi

for dependency in mcp-publisher openssl dig node; do
  if ! command -v "$dependency" >/dev/null 2>&1; then
    printf "Required Official Registry dependency is unavailable: %s\n" "$dependency" >&2
    exit 1
  fi
done

SERVER_NAME="$(node -p "JSON.parse(require('node:fs').readFileSync('server.json','utf8')).name")"
case "$SERVER_NAME" in
  bio.atlarium/*) ;;
  *)
    printf "Refusing domain publication for unexpected server namespace: %s\n" "$SERVER_NAME" >&2
    exit 1
    ;;
esac

PUBLIC_KEY="$(openssl pkey -in "$REGISTRY_KEY_FILE" -pubout -outform DER | tail -c 32 | base64)"
EXPECTED_PROOF="v=MCPv1; k=ed25519; p=$PUBLIC_KEY"
if ! dig +short TXT "$REGISTRY_DOMAIN" | tr -d '"' | grep -Fqx "$EXPECTED_PROOF"; then
  printf "The public MCPv1 DNS proof for %s does not match %s. Restore the matching key or rotate DNS before publishing.\n" "$REGISTRY_DOMAIN" "$REGISTRY_KEY_FILE" >&2
  exit 1
fi

mcp-publisher validate server.json
ATLARIUM_REGISTRY_PRIVATE_KEY="$(openssl pkey -in "$REGISTRY_KEY_FILE" -noout -text | grep -A3 'priv:' | tail -n +2 | tr -d ' :\n')"
mcp-publisher login dns --domain "$REGISTRY_DOMAIN" --private-key "$ATLARIUM_REGISTRY_PRIVATE_KEY"
unset ATLARIUM_REGISTRY_PRIVATE_KEY
mcp-publisher publish server.json
node scripts/verify-official-registry.mjs
