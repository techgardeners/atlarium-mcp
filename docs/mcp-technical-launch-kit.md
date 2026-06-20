# Atlarium MCP Technical Launch Kit

Last updated: 2026-06-20

## Technical Article

# Atlarium Habitat Database MCP: structured habitat data for AI agents

Atlarium Habitat Database MCP is a public read-only Model Context Protocol
server for structured aquarium, marine, terrarium and paludarium habitat data.
It is designed for agents that need species profiles, aquatic plant profiles,
product references, diagnostics, medicines, water parameters, compatibility
checks, fertilization support, guide content, public calculators and complete
habitat suggestions without touching private Atlarium accounts or workspace
data.

The public endpoint is:

```text
https://mcp.atlarium.bio/mcp
```

The server uses Streamable HTTP and does not require authentication. Discovery
metadata is available through both the public server card and the Official MCP
Registry entry:

```text
https://mcp.atlarium.bio/.well-known/mcp/server-card.json
bio.atlarium/habitat-database
```

The V2 tool surface is public, read-only and grouped by family:

- Catalog: `search_fish`, `get_fish_profile`, `search_plants`, `get_plant_profile`.
- General products and guides: `search_products`, `get_product_profile`, `search_guides`, `get_guide`.
- Compatibility and water: `check_species_compatibility`, `get_water_parameters`, `suggest_species_for_tank`.
- Diagnostics: `search_algae`, `get_algae_profile`, `search_diseases`, `get_disease_profile`, `search_plant_problems`, `get_plant_problem_profile`, `search_medicines`, `get_medicine_profile`, `match_diagnostic_profiles`.
- Product catalog: `list_product_categories`, `list_product_brands`, `search_equipment`, `get_equipment_profile`, `search_fertilizers`, `get_fertilizer_profile`.
- Fertilization: `search_fertilization_regimes`, `get_fertilization_regime`, `calculate_fertilizer_dose`, `calculate_nutrient_gaps`, `calculate_weekly_dose_totals`, `generate_fertilization_plan`.
- Calculators: `calculate_tank_volume`, `calculate_tank_weight`, `calculate_water_change`, `calculate_water_chemistry`, `convert_units`, `calculate_equipment_requirements`.
- Planner: `suggest_habitat_for_tank`.

All 39 tools are read-only. The server card marks the server as `auth.type =
none`, `readOnly = true`, and exposes no workspace, auth, admin, user or write
tools. Diagnostics, compatibility, fertilization, calculator and tank planning
outputs are advisory; they are meant to help agents organize public reference
data, not replace care decisions for real animals, plants, equipment, water
chemistry or structural safety.

For client setup, use any MCP client that supports remote Streamable HTTP MCP
servers. For example, in clients that accept an MCP server config:

```json
{
  "mcpServers": {
    "atlarium-habitat-database": {
      "type": "streamable-http",
      "url": "https://mcp.atlarium.bio/mcp"
    }
  }
}
```

For Claude Code users with remote HTTP MCP support:

```bash
claude mcp add --transport http atlarium https://mcp.atlarium.bio/mcp
```

For SDK or debugging workflows, start with tool discovery:

```bash
pnpm mcp:monitor:public
pnpm mcp:validate:public
```

Those checks verify the live docs, health endpoint, server card, JSON-RPC
session, prompts, widget resource and the expected 39-tool read-only surface.
The validation script calls representative tools from each public family with
controlled inputs.

The source repository is:

```text
https://github.com/techgardeners/atlarium-mcp
```

The human documentation is:

```text
https://atlarium.bio/mcp
```

For Apps-compatible hosts, the server also advertises the read-only ChatGPT
App widget resource `ui://widget/habitat-explorer.v3.html` with MIME type
`text/html;profile=mcp-app`. The widget is `Atlarium Habitat Explorer` and is
linked from tool metadata through `_meta.ui.resourceUri` plus
`_meta["openai/outputTemplate"]`. The widget resource declares the dedicated
origin `https://mcp.atlarium.bio` through `_meta.ui.domain` and
`_meta["openai/widgetDomain"]`.

## Short Demo Script

### 1. Install or configure the endpoint

Use the remote Streamable HTTP endpoint:

```text
https://mcp.atlarium.bio/mcp
```

Example config:

```json
{
  "mcpServers": {
    "atlarium-habitat-database": {
      "type": "streamable-http",
      "url": "https://mcp.atlarium.bio/mcp"
    }
  }
}
```

### 2. Discover tools

Run tool discovery in your MCP client, or from this repo:

```bash
pnpm mcp:monitor:public
```

Expected result:

```text
39 tools from JSON-RPC tools/list
```

### 3. Query habitat data

Prompt:

```text
Use Atlarium to search for Blue Acara and summarize its public habitat profile.
```

Expected behavior:

```text
The client calls `search_fish` or `get_fish_profile` and summarizes public
profile data such as tank size, temperature and water parameters when available.
```

### 4. Check compatibility

Prompt:

```text
Check whether Corydoras paleatus and Betta splendens are compatible, and explain the water parameter tradeoffs.
```

Expected behavior:

```text
The client calls `check_species_compatibility`, summarizes compatibility signals
and includes an advisory caveat.
```

### 5. Suggest tank inhabitants

Prompt:

```text
Suggest peaceful freshwater species for a 90 liter planted tank at 24 C with pH 6.8.
```

Expected behavior:

```text
The client calls `suggest_species_for_tank`, returns a short list of public
species suggestions and keeps the answer read-only and advisory.
```

### 6. Show the ChatGPT App widget

Prompt:

```text
Use the Atlarium Habitat Explorer widget to show a profile card for Blue Acara and inspect its water parameters.
```

Expected behavior:

```text
An Apps-compatible host reads `ui://widget/habitat-explorer.v3.html`, renders
the Habitat Explorer widget and uses structured tool output to populate the
profile card. Generic MCP clients can still consume the plain JSON text output.
```

## MCP-Specific Community Posts

### Directory / registry post

```text
Atlarium Habitat Database MCP is live in the Official MCP Registry as `bio.atlarium/habitat-database`.

It is a public read-only Streamable HTTP MCP server for structured aquarium,
marine, terrarium and paludarium habitat data.

Endpoint: https://mcp.atlarium.bio/mcp
Docs: https://atlarium.bio/mcp
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Repo: https://github.com/techgardeners/atlarium-mcp

Tool surface: 39 read-only tools for species, plants, products, diagnostics,
medicines, water parameters, compatibility checks, fertilization, calculators,
guide lookup and complete habitat suggestions.
Auth: none. Data: public Atlarium habitat data. No user/workspace/admin/write
tools.
```

### Developer forum post

```text
We published Atlarium Habitat Database MCP, a remote Streamable HTTP MCP server
for public habitat reference data.

Use cases:
- search fish and aquatic animal profiles
- retrieve aquatic plant profiles
- search habitat products
- search algae, diseases, plant problems and medicines
- check basic species compatibility
- calculate volume, weight, water changes, water chemistry and equipment needs
- build advisory fertilization plans from public catalog data
- get water parameter guidance
- suggest complete habitat plans for a tank profile
- search public Atlarium guides

Endpoint: https://mcp.atlarium.bio/mcp
Docs and client examples: https://atlarium.bio/mcp
Official MCP Registry: bio.atlarium/habitat-database
Source: https://github.com/techgardeners/atlarium-mcp

The server is read-only, requires no auth and exposes only public data. Compatibility and tank suggestions are advisory.
```

### Glama / Smithery follow-up post

```text
Atlarium Habitat Database MCP is available as a public remote MCP endpoint:
https://mcp.atlarium.bio/mcp

Registry: bio.atlarium/habitat-database
Docs: https://atlarium.bio/mcp
Repo: https://github.com/techgardeners/atlarium-mcp

It exposes 39 read-only tools for public habitat data and advisory public
functions. It does not expose private Atlarium accounts, workspaces, admin APIs
or write operations.

We are completing directory claim/submission flows and will add directory badges
only after each listing is accepted and visible.
```
