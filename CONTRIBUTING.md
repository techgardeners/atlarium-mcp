# Contributing

Thanks for helping improve Atlarium Habitat Database MCP.

## Development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Use the local Atlarium app as the upstream data provider when testing tool
behavior:

```bash
ATLARIUM_API_BASE_URL=http://localhost:43117/api/public/mcp/v1 pnpm dev
```

## Change Requirements

For public tool changes, update all affected surfaces in the same change:

- `src/schemas.ts`
- `src/atlarium-api.ts`
- `src/tools.ts`
- unit tests
- `src/metadata.ts`
- `server.json`
- `docs/mcp.md`
- `docs/mcp/server-card.json.example`
- `README.md`
- client examples in `examples/`
- `docs/publication-checklist.md`

All tools in this repository must remain public and read-only. Workspace, user,
auth, admin and write operations belong outside this public MCP server.

## Quality Gate

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For production validation:

```bash
pnpm mcp:validate:public
pnpm mcp:conformance:public
```

## Pull Requests

- Keep claims precise; do not say a client or directory officially supports the
  server unless the external listing is visible.
- Keep examples based on the real public tool surface.
- Do not commit secrets, API tokens or private Atlarium data.
