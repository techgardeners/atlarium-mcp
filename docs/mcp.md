# Atlarium Habitat Database MCP

## Overview

Atlarium Habitat Database MCP is a public, read-only MCP server for structured
habitat data from Atlarium.bio. It is designed for AI agents that need
aquarium, marine, coldwater, terrarium, paludarium and vivarium reference data
without access to private workspace or user data.

Description:

> Structured aquarium, marine, terrarium and paludarium data for AI agents.

Long description:

> Atlarium MCP is a public read-only MCP server that gives AI agents structured
> access to data for aquariums, marine tanks, coldwater systems, terrariums,
> paludariums and vivariums. It includes animals, plants, products, care
> requirements, environmental parameters, compatibility information, guides and
> habitat planning tools.

## Public URLs

- MCP endpoint: `https://mcp.atlarium.bio/mcp`
- Healthcheck: `https://mcp.atlarium.bio/health`
- Server card: `https://mcp.atlarium.bio/.well-known/mcp/server-card.json`
- Human documentation: `https://atlarium.bio/mcp`
- Repository: `https://github.com/techgardeners/atlarium-mcp`

`https://atlarium.bio/mcp` is the public documentation page. The canonical MCP
Streamable HTTP endpoint is `https://mcp.atlarium.bio/mcp`.

## Development URLs

- Healthcheck: `GET http://localhost:43118/health`
- Server card: `GET http://localhost:43118/.well-known/mcp/server-card.json`
- MCP endpoint: `POST http://localhost:43118/mcp`

The server consumes the public read-only Atlarium data provider:

- `https://atlarium.bio/api/public/mcp/v1`

## Transport

The server uses MCP Streamable HTTP via `@modelcontextprotocol/sdk`.

## ChatGPT App Widget

The server also exposes a read-only MCP Apps / ChatGPT Apps widget resource:

- Resource URI: `ui://widget/habitat-explorer.v1.html`
- MIME type: `text/html;profile=mcp-app`
- Title: `Atlarium Habitat Explorer`

The widget renders structured tool results as habitat cards, profiles,
compatibility summaries and tank suggestions. Tool responses keep plain JSON
text content for generic MCP clients and also include `structuredContent` for
Apps-compatible hosts. Tools link to the widget with `_meta.ui.resourceUri` and
the ChatGPT compatibility alias `_meta["openai/outputTemplate"]`.

## Tools

- `search_fish`: search fish and aquatic animal profiles in the Atlarium habitat database.
- `get_fish_profile`: get a structured fish or aquatic animal profile.
- `search_plants`: search aquatic plants.
- `get_plant_profile`: get a structured aquatic plant profile.
- `search_products`: search habitat products for aquariums, terrariums and related systems.
- `get_product_profile`: get a structured habitat product profile.
- `check_species_compatibility`: check basic compatibility between habitat species.
- `get_water_parameters`: get recommended water parameters for an aquatic species or plant.
- `suggest_species_for_tank`: suggest compatible aquatic species from tank size and water parameters.
- `search_guides`: search Atlarium habitat guides and educational content.
- `get_guide`: get a structured guide.

All tools are read-only and have `readOnlyHint: true`, `destructiveHint: false`
and `idempotentHint: true`. No additional write, auth, user, workspace or admin
tools are added for the ChatGPT App.

## Security

- No login is required in v1.
- No write, destructive, workspace, auth, user or admin tools are registered.
- Rate limiting is enabled by default.
- Inputs are validated with strict Zod schemas.
- Unknown tool input fields are rejected.
- HTTP security headers are set by the application; HSTS is expected at the TLS
  edge rather than in the Node process.
- The `Host` header is allowlisted to reduce DNS rebinding risk.
- Errors are sanitized and never include stack traces.
- Logs include tool name, duration and status, but not full payloads or secrets.
- The server only calls `ATLARIUM_API_BASE_URL`, which must point to the public
  read-only Atlarium API.
- Production assumes a trusted TLS reverse proxy. Configure `MCP_TRUST_PROXY`
  to match that proxy topology and ensure the proxy overwrites forwarded headers.
- Upstream Atlarium API calls use a timeout and maximum response size.

## Local Test Examples

Health:

```bash
curl http://localhost:43118/health
```

Server card:

```bash
curl http://localhost:43118/.well-known/mcp/server-card.json
```

Manual JSON-RPC initialize:

```bash
curl -s http://localhost:43118/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"0.0.1"}}}'
```

Conformance:

```bash
pnpm mcp:conformance
```

Widget resource smoke:

```bash
npx @modelcontextprotocol/inspector@latest --server-url http://localhost:43118/mcp --transport http
```

In the inspector, confirm `resources/list` includes
`ui://widget/habitat-explorer.v1.html` and `resources/read` returns HTML with
MIME type `text/html;profile=mcp-app`.

The conformance script runs the core, tools and DNS rebinding scenarios that
match this server's declared capabilities. The upstream active suite also
contains prompts, resources, completion and elicitation scenarios that are not
part of this v1 server.

## Production Validation

After Kubernetes, DNS and TLS are live:

```bash
curl -i https://mcp.atlarium.bio/health
curl -i https://mcp.atlarium.bio/.well-known/mcp/server-card.json
curl -i https://mcp.atlarium.bio/mcp
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario server-initialize
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario tools-list
```

Also run a real `tools/call` check for each registered tool and verify that no
workspace, auth, admin or write tool appears in `tools/list`.

## Client Installation Examples

Production setup examples live in `examples/`:

- OpenAI Agents SDK: `examples/openai-agents-python`
- Claude Code: `examples/claude-code`
- Cursor: `examples/cursor`
- Windsurf: `examples/windsurf`
- VS Code: `examples/vscode`
- Antigravity: `examples/antigravity`
- ChatGPT Apps submission notes: `examples/chatgpt-apps`
- Generic Streamable HTTP checks: `examples/generic-streamable-http`

The public docs mirror these examples:

- https://atlarium.bio/mcp/openai-agents
- https://atlarium.bio/mcp/claude
- https://atlarium.bio/mcp/cursor
- https://atlarium.bio/mcp/windsurf
- https://atlarium.bio/mcp/vscode
- https://atlarium.bio/mcp/antigravity
- https://atlarium.bio/mcp/smithery
- https://atlarium.bio/mcp/chatgpt

Do not add directory badges or official client-support claims until the external
listing or approval is visible.

## Adding Tools

1. Add input schema in `src/schemas.ts`.
2. Add API client method in `src/atlarium-api.ts`.
3. Add read-only tool definition in `src/tools.ts`.
4. Add unit tests for schema, API path mapping and read-only registration.
5. Update this document, `server.json` and `.example` registry files when the
   public surface changes.

## Not Supported

- Workspace habitat operations.
- User, auth, admin, journal, schedule or measurement data.
- Write or destructive tools.
- Private Atlarium app APIs.
