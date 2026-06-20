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
> paludariums and vivariums. It includes animals, plants, products, guides,
> algae, diseases, plant problems, medicines, compatibility, fertilization,
> public calculators and habitat planning tools.

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

- Resource URI: `ui://widget/habitat-explorer.v3.html`
- MIME type: `text/html;profile=mcp-app`
- Title: `Atlarium Habitat Explorer`
- Dedicated widget origin: `https://mcp.atlarium.bio`

The widget renders structured tool results as habitat cards, profiles,
diagnostic summaries, product results, calculator output, compatibility
summaries and tank suggestions. Tool responses keep plain JSON text content for
generic MCP clients and also include `structuredContent` for Apps-compatible
hosts. Tools link to the widget with `_meta.ui.resourceUri` and the ChatGPT
compatibility alias `_meta["openai/outputTemplate"]`.

The widget is styled as a self-contained Atlarium-native interface using inline
CSS tokens from the public Atlarium palette and embedded JPEG logo data URIs for
light and dark surfaces. Its UI labels and status messages localize to English,
Italian or Spanish from the host/browser locale, while tool calls pass the same
language where supported. It does not load remote fonts, scripts, styles,
iframes or fetch data from the widget. Optional species media is rendered only
when it is already present in structured tool payloads as data images or HTTPS
Atlarium image URLs, with the widget CSP keeping `connectDomains` and
`frameDomains` empty and limiting `resourceDomains` to `https://atlarium.bio`
and `https://mcp.atlarium.bio`. The resource metadata also declares
`_meta.ui.domain` and the ChatGPT compatibility alias
`_meta["openai/widgetDomain"]` for app submission.

## Tools

Current V2 public tool groups:

- Species and plants: `search_fish`, `get_fish_profile`, `search_plants`,
  `get_plant_profile`, `get_water_parameters`, `suggest_species_for_tank`,
  `check_species_compatibility`, `suggest_habitat_for_tank`.
- Products and equipment: `search_products`, `get_product_profile`,
  `list_product_categories`, `list_product_brands`, `search_equipment`,
  `get_equipment_profile`.
- Diagnostics and treatment references: `search_algae`, `get_algae_profile`,
  `search_diseases`, `get_disease_profile`, `search_plant_problems`,
  `get_plant_problem_profile`, `search_medicines`, `get_medicine_profile`,
  `match_diagnostic_profiles`.
- Fertilization: `search_fertilizers`, `get_fertilizer_profile`,
  `search_fertilization_regimes`, `get_fertilization_regime`,
  `calculate_fertilizer_dose`, `calculate_nutrient_gaps`,
  `calculate_weekly_dose_totals`, `generate_fertilization_plan`.
- Calculators and guides: `calculate_tank_volume`, `calculate_tank_weight`,
  `calculate_water_change`, `calculate_water_chemistry`, `convert_units`,
  `calculate_equipment_requirements`, `search_guides`, `get_guide`.

All tools are read-only and have `readOnlyHint: true`, `openWorldHint: false`,
`destructiveHint: false` and `idempotentHint: true`. No write, auth, user,
workspace or admin tools are added for the ChatGPT App.

## Security

- No login is required.
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
`ui://widget/habitat-explorer.v3.html` and `resources/read` returns HTML with
MIME type `text/html;profile=mcp-app`.

The conformance script runs the core, tools and DNS rebinding scenarios that
match this server's declared capabilities. The upstream active suite also
contains completion and elicitation scenarios that are not part of this public
server.

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
