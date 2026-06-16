# Atlarium MCP

Public read-only MCP server for Atlarium freshwater aquarium data.

Atlarium MCP gives AI agents structured access to freshwater aquarium fish,
aquatic plants, water parameters, compatibility data, product references and
aquarium planning information from Atlarium.bio.

## Local Development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

By default the server listens on `http://localhost:43118`.

Useful endpoints:

- `GET /health`
- `POST /mcp`

Local development against the Aquarium app:

```bash
ATLARIUM_API_BASE_URL=http://localhost:43117/api/public/mcp/v1 pnpm dev
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

All tools are read-only. This repository does not contain Atlarium private app
code and does not access workspace, user, admin, or write APIs.

## Quality Gate

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Publication

Do not submit this server to external MCP registries from this repository until
the production endpoint, ownership, license, support policy and security review
are explicitly approved.
