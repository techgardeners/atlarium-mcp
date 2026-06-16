# Atlarium MCP Publication Checklist

Date prepared: 2026-06-16

## Target

- Public MCP name: `Atlarium Habitat Database MCP`
- Official Registry namespace: `bio.atlarium/habitat-database`
- Fallback namespace: `io.github.techgardeners/atlarium-habitat-database`
- Canonical MCP endpoint: `https://mcp.atlarium.bio/mcp`
- Healthcheck: `https://mcp.atlarium.bio/health`
- Server card: `https://mcp.atlarium.bio/.well-known/mcp/server-card.json`
- Human docs page: `https://atlarium.bio/mcp`
- Repository: `https://github.com/techgardeners/atlarium-mcp`
- Container fallback registry: `ghcr.io/techgardeners/atlarium-mcp`

## Current External Blockers

- `mcp.atlarium.bio` must be created in DNS and routed to the Atlarium Ingress/load balancer.
- Atlarium Kubernetes credentials are required to apply `deploy/kubernetes`.
- Atlarium registry credentials are required if using an internal registry instead of GHCR.
- `https://atlarium.bio/mcp` must become the human documentation page, not a protected MCP endpoint.
- `https://atlarium.bio/llms.txt` must be updated with the MCP section from `docs/llms.txt.example`.
- Public registry submissions should wait until DNS, TLS, server card and conformance checks pass against production.

Manual online checks from 2026-06-16 before this repo-side implementation found
that `mcp.atlarium.bio` did not resolve yet, `atlarium.bio/mcp` was not the
final documentation page, and the current Atlarium-hosted MCP fallback required
authorization. Re-run the validation section after deployment.

## Production Deployment

1. Build and push the container image.

Preferred local pipeline:

```bash
PUSH_IMAGE=true pnpm pipeline:local
```

Manual equivalent:

```bash
docker build -t ghcr.io/techgardeners/atlarium-mcp:1.0.0 .
docker push ghcr.io/techgardeners/atlarium-mcp:1.0.0
```

2. Deploy to Atlarium Kubernetes.

Preferred local pipeline:

```bash
PUSH_IMAGE=true DEPLOY_KUBERNETES=true pnpm pipeline:local
```

Manual equivalent:

```bash
kubectl apply -k deploy/kubernetes
kubectl -n atlarium-mcp rollout status deployment/atlarium-mcp
```

3. Create DNS.

Point `mcp.atlarium.bio` to the Atlarium Ingress/load balancer. If Cloudflare is
enabled, confirm registry scanners can access `/health`,
`/.well-known/mcp/server-card.json` and `POST /mcp` without CAPTCHA, 401, 403 or
excessive rate limiting.

4. Validate public HTTPS.

```bash
curl -i https://mcp.atlarium.bio/health
curl -i https://mcp.atlarium.bio/.well-known/mcp/server-card.json
curl -i https://mcp.atlarium.bio/mcp
```

Expected:

- `/health`: HTTP 200 JSON.
- `/.well-known/mcp/server-card.json`: HTTP 200 JSON with `auth.type = none`.
- `GET /mcp`: HTTP 405 JSON-RPC method-not-allowed.
- No `x-powered-by` header.
- TLS certificate valid for `mcp.atlarium.bio`.

5. Run MCP conformance against production.

```bash
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario server-initialize
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario logging-set-level
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario ping
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario tools-list
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario tools-call-simple-text
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario tools-call-error
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario dns-rebinding-protection
```

6. Verify the real tool surface.

Run `initialize`, `tools/list` and one controlled `tools/call` for each tool:

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

Confirm no workspace, auth, admin, user or write tools are listed.

## Official MCP Registry

Official docs:

- `https://modelcontextprotocol.io/registry/quickstart`
- `https://modelcontextprotocol.io/registry/remote-servers`
- `https://modelcontextprotocol.io/registry/authentication`

The repo now includes `server.json` for a remote Streamable HTTP server.

Preferred domain namespace:

```text
bio.atlarium/habitat-database
```

Fallback GitHub namespace:

```text
io.github.techgardeners/atlarium-habitat-database
```

Publish after endpoint validation:

```bash
mcp-publisher login dns
mcp-publisher publish
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=bio.atlarium/habitat-database"
```

If DNS namespace verification is not ready:

1. Change `server.json` `name` to `io.github.techgardeners/atlarium-habitat-database`.
2. Publish with GitHub authentication.

```bash
mcp-publisher login github
mcp-publisher publish
```

## Directory Submission Copy

Name:

```text
Atlarium Habitat Database MCP
```

Short description:

```text
Structured aquarium, marine, terrarium and paludarium data for AI agents.
```

Long description:

```text
Atlarium MCP is a public read-only MCP server that gives AI agents structured access to data for aquariums, marine tanks, coldwater systems, terrariums, paludariums and vivariums. It includes animals, plants, products, care requirements, environmental parameters, compatibility information, guides and habitat planning tools.
```

Connection:

```text
Transport: Streamable HTTP
Endpoint: https://mcp.atlarium.bio/mcp
Auth: none
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Repository: https://github.com/techgardeners/atlarium-mcp
```

Safety statement:

```text
Atlarium Habitat Database MCP is read-only. It does not expose user accounts, workspaces, admin APIs, private data or write operations.
```

## Submission Tracker

| Directory | Submission URL | Account | Status | Date | Error | Next Action |
| --- | --- | --- | --- | --- | --- | --- |
| Official MCP Registry | https://modelcontextprotocol.io/registry/quickstart | Atlarium DNS or TechGardeners GitHub | Blocked | 2026-06-16 | DNS/production endpoint not live | Deploy, validate, then publish `server.json` |
| Smithery | https://smithery.ai/new | Atlarium/TechGardeners | Blocked | 2026-06-16 | Public endpoint not live | Submit URL after server-card and conformance pass |
| Glama | https://glama.ai/ | Atlarium/TechGardeners | Blocked | 2026-06-16 | Public endpoint not live | Submit GitHub repo after production validation |
| PulseMCP | https://www.pulsemcp.com/submit | Atlarium/TechGardeners | Blocked | 2026-06-16 | Public endpoint not live | Submit endpoint and repo after DNS/TLS |
| MCP.so | https://mcp.so/ | Atlarium/TechGardeners | Blocked | 2026-06-16 | Public endpoint not live | Open submission issue with connection details |
