# Atlarium MCP Kubernetes Deployment

Target: Atlarium Kubernetes, namespace `atlarium-mcp`, public host
`mcp.atlarium.bio`.

## Resources

- `Namespace`: `atlarium-mcp`
- `Deployment`: `atlarium-mcp`
- `Service`: ClusterIP on port 80 to container port 43118
- `Ingress`: `https://mcp.atlarium.bio`
- Probes: `/health`
- MCP endpoint: `/mcp`
- Server card: `/.well-known/mcp/server-card.json`

## Image

Default image:

```bash
ghcr.io/techgardeners/atlarium-mcp:1.0.0
```

To use the Atlarium registry instead:

```bash
kubectl kustomize deploy/kubernetes \
  | sed 's#ghcr.io/techgardeners/atlarium-mcp:1.0.0#registry.atlarium.bio/atlarium-mcp:1.0.0#' \
  | kubectl apply -f -
```

Prefer editing `kustomization.yaml` or using CI image replacement for permanent
registry changes.

## Deploy

Preferred local pipeline:

```bash
PUSH_IMAGE=true DEPLOY_KUBERNETES=true pnpm pipeline:local
```

Manual equivalent:

```bash
kubectl apply -k deploy/kubernetes
kubectl -n atlarium-mcp rollout status deployment/atlarium-mcp
kubectl -n atlarium-mcp get ingress atlarium-mcp
```

## DNS

Create `mcp.atlarium.bio` as a CNAME or A/AAAA record pointing to the Atlarium
Ingress/load balancer target. If Cloudflare is enabled, make sure WAF/rate-limit
rules allow registry scanners and MCP clients to reach:

- `GET /health`
- `GET /.well-known/mcp/server-card.json`
- `POST /mcp`

## TLS

The manifest assumes cert-manager with `ClusterIssuer` named `letsencrypt-prod`
and creates/uses secret `atlarium-mcp-tls`. If Atlarium terminates TLS at
Cloudflare or another edge, adapt `ingress.yaml` to the existing cluster pattern.

## Validate

```bash
curl -i https://mcp.atlarium.bio/health
curl -i https://mcp.atlarium.bio/.well-known/mcp/server-card.json
curl -i https://mcp.atlarium.bio/mcp
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario server-initialize
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario tools-list
```

Expected public behavior:

- `/health` returns HTTP 200 JSON.
- `/.well-known/mcp/server-card.json` returns HTTP 200 JSON.
- `GET /mcp` returns sanitized JSON-RPC HTTP 405.
- `POST /mcp` accepts MCP Streamable HTTP JSON-RPC.
- `tools/list` returns exactly the 11 read-only Atlarium tools.
- No workspace, auth, user, admin or write tools are exposed.
