# Atlarium Habitat Database MCP

Structured aquarium, marine, terrarium and paludarium data for AI agents.

Atlarium Habitat Database MCP is a public read-only MCP server that gives AI
agents structured access to Atlarium habitat data. It exposes public tools for
species, plants, products, water parameters, compatibility checks, guides and
habitat planning without exposing Atlarium accounts, workspaces, admin APIs or
write operations.

## Public Endpoint

| Surface | URL |
|---|---|
| MCP endpoint | `https://mcp.atlarium.bio/mcp` |
| Healthcheck | `https://mcp.atlarium.bio/health` |
| Server card | `https://mcp.atlarium.bio/.well-known/mcp/server-card.json` |
| Human docs | `https://atlarium.bio/mcp` |
| Official MCP Registry | `bio.atlarium/habitat-database` |

`https://atlarium.bio/mcp` is documentation. The canonical Streamable HTTP MCP
endpoint is `https://mcp.atlarium.bio/mcp`.

## Client Setup

Compatible with MCP clients that support remote Streamable HTTP MCP servers. Do
not describe this server as officially supported by ChatGPT, Claude, Cursor,
Windsurf, VS Code, Antigravity or any directory unless that vendor has accepted
the listing.

Client-specific examples live in `examples/`:

- `examples/openai-agents-python`
- `examples/claude-code`
- `examples/cursor`
- `examples/windsurf`
- `examples/vscode`
- `examples/antigravity`
- `examples/chatgpt-apps`
- `examples/generic-streamable-http`

Quick examples:

```bash
claude mcp add --transport http atlarium https://mcp.atlarium.bio/mcp
```

```json
{
  "mcpServers": {
    "atlarium": {
      "url": "https://mcp.atlarium.bio/mcp"
    }
  }
}
```

```json
{
  "servers": {
    "atlarium": {
      "type": "http",
      "url": "https://mcp.atlarium.bio/mcp"
    }
  }
}
```

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

All tools are read-only. Compatibility checks and tank suggestions are advisory
and should be verified against real livestock, equipment, water chemistry and
husbandry constraints.

## ChatGPT App Widget

The server includes a read-only MCP Apps / ChatGPT Apps widget resource for
Apps-compatible hosts:

- resource URI: `ui://widget/habitat-explorer.v1.html`
- MIME type: `text/html;profile=mcp-app`
- widget: `Atlarium Habitat Explorer`

Tool responses keep plain JSON text for generic MCP clients and also return
`structuredContent` for the widget. The tool metadata links the widget with
`_meta.ui.resourceUri` and the ChatGPT compatibility alias
`_meta["openai/outputTemplate"]`.

## Smoke Checks

Health:

```bash
curl --fail --silent --show-error https://mcp.atlarium.bio/health
```

Server card:

```bash
curl --fail --silent --show-error \
  https://mcp.atlarium.bio/.well-known/mcp/server-card.json
```

Initialize:

```bash
curl --fail --silent --show-error \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"0.0.1"}}}' \
  https://mcp.atlarium.bio/mcp
```

Full public validation:

```bash
pnpm mcp:validate:public
pnpm mcp:conformance:public
```

## Local Development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

By default the server listens on `http://localhost:43118`.

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

## Publication And Directories

Publication tracking and reusable submission copy live in
`docs/publication-checklist.md`.

Generate directory payloads:

```bash
pnpm directories:submit -- --payload
```

Check live discovery:

```bash
pnpm directories:submit -- --check
```

## Kubernetes

Kubernetes manifests live in `deploy/kubernetes`.

Preferred Atlarium local pipeline:

```bash
pnpm pipeline:local
PUSH_IMAGE=true pnpm pipeline:local
PUSH_IMAGE=true DEPLOY_KUBERNETES=true pnpm pipeline:local
PUSH_IMAGE=true DEPLOY_KUBERNETES=true VALIDATE_PUBLIC=true pnpm pipeline:local
```

The image is published as `ghcr.io/techgardeners/atlarium-mcp`.

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
pnpm mcp:conformance:public
pnpm mcp:validate:public
```

## Contributing

See `CONTRIBUTING.md`. Public tool changes must update the server
implementation, tests, server-card metadata, `server.json`, docs, examples and
directory publication notes in the same release.

## Security

See `SECURITY.md`. Do not report sensitive security issues in public GitHub
issues.

## License

MIT. See `LICENSE`.
