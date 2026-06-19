# Atlarium Habitat Database MCP

Atlarium Habitat Database MCP is a public read-only Model Context Protocol
server for structured habitat data from Atlarium.bio.

It gives AI agents access to aquarium, marine, coldwater, terrarium,
paludarium and vivarium reference data without exposing private workspaces,
accounts, admin APIs or write operations.

## Endpoint

```text
https://mcp.atlarium.bio/mcp
```

Transport:

```text
Streamable HTTP
```

Authentication:

```text
None
```

Healthcheck:

```text
https://mcp.atlarium.bio/health
```

Server card:

```text
https://mcp.atlarium.bio/.well-known/mcp/server-card.json
```

Repository:

```text
https://github.com/techgardeners/atlarium-mcp
```

## Installation Guides

- OpenAI Agents SDK: https://atlarium.bio/mcp/openai-agents
- Claude Code: https://atlarium.bio/mcp/claude
- Cursor: https://atlarium.bio/mcp/cursor
- Windsurf: https://atlarium.bio/mcp/windsurf
- VS Code: https://atlarium.bio/mcp/vscode
- Antigravity: https://atlarium.bio/mcp/antigravity
- Smithery status: https://atlarium.bio/mcp/smithery
- ChatGPT Apps preparation: https://atlarium.bio/mcp/chatgpt

## What It Provides

- Fish and aquatic animal profiles
- Aquatic plant profiles
- Habitat product data
- Water and environmental parameters
- Basic compatibility information
- Tank and habitat planning suggestions
- Atlarium guides and educational content

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

## Safety And Scope

Atlarium Habitat Database MCP is read-only. It does not expose user accounts,
private workspaces, admin APIs, journal data, schedules, measurements or write
operations.

Compatibility and planning suggestions are advisory. They should be checked
against the needs of the real animals, plants, enclosure, equipment and local
conditions before making husbandry decisions.

## Example Initialize Request

```bash
curl -s https://mcp.atlarium.bio/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"0.0.1"}}}'
```
