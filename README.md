# Atlarium Habitat Database MCP

Public read-only MCP server for structured aquarium, marine, terrarium and
paludarium habitat data.

Atlarium Habitat Database MCP gives AI agents structured access to Atlarium data
for aquariums, marine tanks, coldwater systems, terrariums, paludariums and
vivariums. It exposes animals, plants, products, care requirements,
environmental parameters, compatibility information, guides and habitat planning
tools from Atlarium.bio.

## Public Surface

- MCP endpoint: `https://mcp.atlarium.bio/mcp`
- Healthcheck: `https://mcp.atlarium.bio/health`
- Server card: `https://mcp.atlarium.bio/.well-known/mcp/server-card.json`
- Human documentation: `https://atlarium.bio/mcp`
- Registry metadata: `server.json`

`https://atlarium.bio/mcp` is documentation, not the canonical MCP endpoint.

## Local Development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

By default the server listens on `http://localhost:43118`.

Useful endpoints:

- `GET /health`
- `GET /.well-known/mcp/server-card.json`
- `POST /mcp`

Local development against the Atlarium app:

```bash
ATLARIUM_API_BASE_URL=http://localhost:43117/api/public/mcp/v1 pnpm dev
```

## Configuration

- `MCP_PUBLIC_BASE_URL`: public base URL, production default `https://mcp.atlarium.bio`.
- `ATLARIUM_API_BASE_URL`: public read-only Atlarium API base URL.
- `MCP_ALLOWED_HOSTS`: comma-separated host allowlist used for DNS rebinding protection.
- `MCP_TRUST_PROXY`: Express proxy trust setting; default `1` assumes one trusted reverse proxy in production.
- `ATLARIUM_API_TIMEOUT_MS`: upstream public API timeout in milliseconds.
- `ATLARIUM_API_RESPONSE_MAX_BYTES`: maximum upstream JSON response size.

Production deployments must run behind a TLS-terminating reverse proxy or
Ingress that overwrites `X-Forwarded-For`, `X-Forwarded-Host` and
`X-Forwarded-Proto` before traffic reaches this server.

## Tools

- `search_fish`
- `get_fish_profile`
- `search_plants`
- `get_plant_profile`
- `search_products`
- `get_product_profile`
- `check_species_compatibility`
- `get_water_parameters`
- `suggest_species_for_tank`
- `search_guides`
- `get_guide`

All tools are read-only. This repository does not contain Atlarium private app
code and does not access workspace, user, admin or write APIs.

## Kubernetes

Kubernetes manifests live in `deploy/kubernetes`.

Atlarium deployment is driven by the local pipeline, not GitHub Actions:

```bash
pnpm pipeline:local
PUSH_IMAGE=true pnpm pipeline:local
PUSH_IMAGE=true DEPLOY_KUBERNETES=true pnpm pipeline:local
PUSH_IMAGE=true DEPLOY_KUBERNETES=true VALIDATE_PUBLIC=true pnpm pipeline:local
```

```bash
kubectl apply -k deploy/kubernetes
kubectl -n atlarium-mcp rollout status deployment/atlarium-mcp
```

Default production env:

```bash
NODE_ENV=production
MCP_PUBLIC_BASE_URL=https://mcp.atlarium.bio
ATLARIUM_API_BASE_URL=https://atlarium.bio/api/public/mcp/v1
MCP_ALLOWED_HOSTS=mcp.atlarium.bio,atlarium.bio
MCP_TRUST_PROXY=1
```

The image is published as `ghcr.io/techgardeners/atlarium-mcp`. Atlarium can
override this to its internal registry in the Kubernetes kustomization or CI
deployment workflow.

## Quality Gate

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit:prod
docker build -t atlarium-mcp:local .
```

With a local server running:

```bash
pnpm mcp:conformance
```

With production DNS and TLS live:

```bash
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario server-initialize
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario tools-list
```

## Publication

The preferred Official MCP Registry namespace is
`bio.atlarium/habitat-database` once DNS ownership for `atlarium.bio` is
verified. The fallback namespace is
`io.github.techgardeners/atlarium-habitat-database`.

Publication tracking and submission copy live in
`docs/publication-checklist.md`.
