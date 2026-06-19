# Atlarium MCP Publication Checklist

Date prepared: 2026-06-16
Last updated: 2026-06-19

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

## Current Status

- `mcp.atlarium.bio` resolves through Cloudflare to the Atlarium Ingress.
- `https://mcp.atlarium.bio/health` returns public JSON.
- `https://mcp.atlarium.bio/.well-known/mcp/server-card.json` returns public JSON.
- `https://mcp.atlarium.bio/mcp` is the canonical Streamable HTTP endpoint.
- `https://atlarium.bio/mcp` returns the public human documentation page.
- `https://atlarium.bio/mcp/*` client setup pages are implemented for OpenAI Agents SDK, Claude Code, Cursor, Windsurf, VS Code, Antigravity, Smithery status and ChatGPT Apps preparation.
- `https://atlarium.bio/llms.txt` includes the MCP discovery section.
- GitHub repo metadata, README, MIT license, contributing/security notes and client examples are ready.
- Public conformance for initialize, logging, ping, tools/list and tool-call scenarios passes.
- `pnpm mcp:validate:public` verifies all 11 read-only tools with real public calls.
- Official MCP Registry publish succeeded for `bio.atlarium/habitat-database`.
- GitHub Actions monitors are active for public MCP health/server-card/tools-list
  and daily directory/registry discovery checks.
- ChatGPT App widget resource is implemented as
  `ui://widget/habitat-explorer.v1.html` with MIME type
  `text/html;profile=mcp-app`.

Remaining publication prerequisites:

- Smithery and Glama need maintainer OAuth/claim in their web UI.
- PulseMCP ingests the Official MCP Registry; email them only if the listing is
  missing after their processing window.
- MCP.so submission has been posted through the public GitHub issue flow.

Repository production assets:

- `LICENSE`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `.github/ISSUE_TEMPLATE/*`
- `examples/openai-agents-python`
- `examples/claude-code`
- `examples/cursor`
- `examples/windsurf`
- `examples/vscode`
- `examples/antigravity`
- `examples/chatgpt-apps`
- `examples/generic-streamable-http`

GitHub repository settings:

- Description: `Public read-only MCP server for structured aquarium, marine, terrarium and paludarium habitat data.`
- Homepage: `https://atlarium.bio/mcp`
- Topics: `mcp`, `model-context-protocol`, `streamable-http`, `aquarium`, `marine`, `terrarium`, `paludarium`, `ai-agents`, `habitat-data`

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
kubectl get secret atlarium-tls -n aquarium -o yaml \
  | sed 's/namespace: aquarium/namespace: atlarium-mcp/' \
  | kubectl apply -f -
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
pnpm mcp:validate:public
```

The `dns-rebinding-protection` conformance scenario is localhost-only. Run it
through `pnpm mcp:conformance` against a local server, not against the public
HTTPS endpoint.

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

Confirm the ChatGPT App resource:

```bash
npx @modelcontextprotocol/inspector@latest --server-url https://mcp.atlarium.bio/mcp --transport http
```

Expected:

- `resources/list` contains `ui://widget/habitat-explorer.v1.html`.
- `resources/read` returns the Habitat Explorer HTML resource.
- Visual tools include `_meta.ui.resourceUri` and
  `_meta["openai/outputTemplate"]`.
- Tool responses still include text JSON content and now also include
  `structuredContent`.

7. Keep production monitoring active.

The repository contains two GitHub Actions workflows:

- `.github/workflows/public-mcp-monitor.yml` runs every 30 minutes and verifies
  docs, health, server-card validity, `GET /mcp` 405 behavior, JSON-RPC
  initialize, `tools/list` with the expected 11 read-only tools and the
  ChatGPT App widget resource.
- `.github/workflows/mcp-directory-audit.yml` runs daily and checks public docs,
  health, server-card, MCP GET behavior and Official MCP Registry presence.

Manual smoke commands:

```bash
pnpm mcp:monitor:public
pnpm directories:submit -- --check
```

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
| Official MCP Registry | https://modelcontextprotocol.io/registry/quickstart | Atlarium DNS | Published | 2026-06-16 | None | Monitor registry entry and publish future versions from `server.json` |
| Smithery | https://smithery.ai/new | Atlarium/TechGardeners | Ready to submit | 2026-06-16 | None | Submit endpoint, server card and repo |
| Glama | https://glama.ai/ | Atlarium/TechGardeners | Ready to submit | 2026-06-16 | None | Submit GitHub repo and public endpoint |
| PulseMCP | https://www.pulsemcp.com/submit | Atlarium/TechGardeners | Ready to submit | 2026-06-16 | None | Submit endpoint and repo |
| MCP.so | https://github.com/chatmcp/mcpso/issues/1#issuecomment-4722425013 | TechGardeners | Submitted | 2026-06-16 | None | Monitor issue comment and published listing |

## Directory Automation

Generate reusable copy and JSON payloads:

```bash
pnpm directories:submit -- --payload
```

Check the public URLs and Official MCP Registry entry:

```bash
pnpm directories:submit -- --check
```

Open the web submission pages for OAuth/claim-based directories:

```bash
pnpm directories:submit -- --open
```

Submit MCP.so through its GitHub issue flow:

```bash
pnpm directories:submit -- --submit-mcp-so --yes
```
