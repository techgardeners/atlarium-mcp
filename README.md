<p align="center">
  <img src="docs/assets/github-social-preview.png" alt="Atlarium Habitat Database MCP social preview" width="840">
</p>

<h1 align="center">Atlarium Habitat Database MCP</h1>

<p align="center">
  Public read-only MCP server for Atlarium habitat data, diagnostics, products, calculators and advisory planning.
</p>

<p align="center">
  <a href="https://github.com/techgardeners/atlarium-mcp/actions/workflows/public-mcp-monitor.yml"><img alt="Public MCP Monitor" src="https://github.com/techgardeners/atlarium-mcp/actions/workflows/public-mcp-monitor.yml/badge.svg"></a>
  <a href="https://github.com/techgardeners/atlarium-mcp/actions/workflows/mcp-directory-audit.yml"><img alt="MCP Directory Audit" src="https://github.com/techgardeners/atlarium-mcp/actions/workflows/mcp-directory-audit.yml/badge.svg"></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/github/license/techgardeners/atlarium-mcp"></a>
  <a href="https://registry.modelcontextprotocol.io/v0.1/servers?search=bio.atlarium%2Fhabitat-database"><img alt="Official MCP Registry" src="https://img.shields.io/badge/Official_MCP_Registry-bio.atlarium%2Fhabitat--database-0E7C86"></a>
  <img alt="Version 2.0.0" src="https://img.shields.io/badge/version-2.0.0-0E7C86">
  <img alt="Transport: Streamable HTTP" src="https://img.shields.io/badge/transport-Streamable_HTTP-145C9E">
  <img alt="Read-only MCP tools" src="https://img.shields.io/badge/tools-39_read--only-2D7D46">
  <img alt="Prompts enabled" src="https://img.shields.io/badge/prompts-enabled-6B7280">
  <img alt="Auth none" src="https://img.shields.io/badge/auth-none-4B5563">
</p>

<p align="center">
  <a href="https://mcp.atlarium.bio/mcp">MCP endpoint</a>
  ·
  <a href="https://atlarium.bio/mcp">Human docs</a>
  ·
  <a href="https://mcp.atlarium.bio/.well-known/mcp/server-card.json">Server card</a>
  ·
  <a href="docs/mcp.md">Technical docs</a>
  ·
  <a href="examples">Client examples</a>
</p>

Atlarium Habitat Database MCP gives AI agents structured access to public
Atlarium data and advisory functions for aquariums, marine tanks, coldwater
systems, terrariums, paludariums and vivariums. It exposes 39 public read-only
tools for species, plants, products, guides, algae, diseases, plant problems,
medicines, compatibility, fertilization, calculators and complete habitat
planning without exposing Atlarium accounts, private workspaces, admin APIs or
write operations.

## At A Glance

| Surface | Value |
| --- | --- |
| MCP endpoint | `https://mcp.atlarium.bio/mcp` |
| MCP version | `2.0.0` |
| Transport | Streamable HTTP |
| Authentication | none |
| Tool surface | 39 public read-only tools |
| Prompts | 9 guided public prompts |
| Apps widget | `ui://widget/habitat-explorer.v3.html` |
| Server card | `https://mcp.atlarium.bio/.well-known/mcp/server-card.json` |
| Human docs | `https://atlarium.bio/mcp` |
| Official MCP Registry | `bio.atlarium/habitat-database` |

`https://atlarium.bio/mcp` is documentation. The canonical Streamable HTTP MCP
endpoint is `https://mcp.atlarium.bio/mcp`.

## What You Can Build

| Use case | Public tools |
| --- | --- |
| Species research | Search fish, aquatic animals and plants, then retrieve localized structured profiles. |
| Tank compatibility | Compare species against tank size, pH, hardness and temperature constraints. |
| Diagnostic triage | Search algae, aquatic diseases, plant problems and treatment references from public profiles. |
| Product selection | Explore product categories, brands, equipment and fertilizers. |
| Fertilization support | Search dosing regimes, calculate product doses, nutrient gaps and weekly totals. |
| Aquarium calculators | Estimate tank volume, weight, water changes, water chemistry, unit conversions and equipment needs. |
| Habitat planning | Generate a complete advisory tank plan with species, plants, products, warnings, motivations and related guides. |
| Guide retrieval | Search and retrieve public Atlarium educational content. |

All outputs are advisory. Compatibility checks, diagnostics, fertilization
plans, equipment estimates, aquarium calculators and tank suggestions should be
verified against real livestock, equipment, water chemistry, local regulations
and husbandry constraints.

## Quickstart

Use any MCP client that supports remote Streamable HTTP servers:

```json
{
  "mcpServers": {
    "atlarium": {
      "type": "streamable-http",
      "url": "https://mcp.atlarium.bio/mcp"
    }
  }
}
```

Claude Code remote HTTP example:

```bash
claude mcp add --transport http atlarium https://mcp.atlarium.bio/mcp
```

Smoke check the live endpoint:

```bash
curl --fail --silent --show-error https://mcp.atlarium.bio/health
curl --fail --silent --show-error https://mcp.atlarium.bio/.well-known/mcp/server-card.json
pnpm mcp:monitor:public
```

## Client Setup

| Client or host | Setup |
| --- | --- |
| OpenAI Agents SDK | See `examples/openai-agents-python` for a Python agent that connects to the remote Streamable HTTP endpoint. |
| Claude Code | Run `claude mcp add --transport http atlarium https://mcp.atlarium.bio/mcp`, then ask Claude to use Atlarium. |
| Cursor | Copy `examples/cursor/mcp.json` into your Cursor MCP config and reload Cursor. |
| Windsurf | Copy `examples/windsurf/mcp_config.json` into Windsurf MCP settings and refresh Cascade MCP servers. |
| VS Code | Copy `examples/vscode/mcp.json`; VS Code uses `type: "http"` for remote MCP servers. |
| Antigravity | Use `examples/antigravity/mcp.json` only in builds that support remote MCP servers. |
| Generic Streamable HTTP | Use the JSON-RPC examples in `examples/generic-streamable-http`. |
| ChatGPT Apps | Submitted for review with the Habitat Explorer widget; use `examples/chatgpt-apps` for review notes, smoke prompts and screenshot checklist. Public approval is not claimed. |

These are compatibility notes, not vendor endorsements. Do not make vendor or
directory support claims for ChatGPT, Claude, Cursor, Windsurf, VS Code,
Antigravity or any directory unless that vendor has accepted the listing.

## ChatGPT App And Widget

The server advertises a read-only MCP Apps / ChatGPT Apps widget resource for
Apps-compatible hosts:

| Field | Value |
| --- | --- |
| Resource URI | `ui://widget/habitat-explorer.v3.html` |
| MIME type | `text/html;profile=mcp-app` |
| Widget | `Atlarium Habitat Explorer` |
| Widget domain | `https://mcp.atlarium.bio` |
| Output mode | Plain JSON text plus `structuredContent` |

The widget renders public habitat results, profiles, diagnostic summaries,
product results, calculator output, compatibility summaries, fertilization
plans and habitat suggestions. It does not add write access and does not expose
workspace, auth, admin, journal, schedule or measurement data.

ChatGPT Developer Mode screenshots and a short demo recording are checked in
under `docs/assets/chatgpt-screenshots/` and `docs/assets/chatgpt-app-demo.mp4`.
The ChatGPT App is submitted / in review; do not describe it as approved or
publicly available until OpenAI accepts it.

## Tool Surface

| Area | Tools |
| --- | --- |
| Fish and aquatic animals | `search_fish`, `get_fish_profile` |
| Aquatic plants | `search_plants`, `get_plant_profile` |
| Products and guides | `search_products`, `get_product_profile`, `search_guides`, `get_guide` |
| Diagnostics | `search_algae`, `get_algae_profile`, `search_diseases`, `get_disease_profile`, `search_plant_problems`, `get_plant_problem_profile`, `search_medicines`, `get_medicine_profile`, `match_diagnostic_profiles` |
| Product catalog | `list_product_categories`, `list_product_brands`, `search_equipment`, `get_equipment_profile`, `search_fertilizers`, `get_fertilizer_profile` |
| Compatibility and water | `check_species_compatibility`, `get_water_parameters`, `suggest_species_for_tank` |
| Fertilization | `search_fertilization_regimes`, `get_fertilization_regime`, `calculate_fertilizer_dose`, `calculate_nutrient_gaps`, `calculate_weekly_dose_totals`, `generate_fertilization_plan` |
| Calculators | `calculate_tank_volume`, `calculate_tank_weight`, `calculate_water_change`, `calculate_water_chemistry`, `convert_units`, `calculate_equipment_requirements` |
| Habitat planner | `suggest_habitat_for_tank` |

Every tool is registered with read-only annotations:
`readOnlyHint: true`, `openWorldHint: false`, `destructiveHint: false`,
`idempotentHint: true`.

## Guided Prompts

The server advertises guided prompts for species search, compatibility, habitat
planning, algae, diseases, plant problems, product selection, fertilization and
tank calculations. Prompts guide clients toward the same public read-only tool
surface; they do not add new capabilities or write access.

## Tool Call Examples

Each example shows the MCP tool name and a minimal valid JSON input. Generic
MCP clients receive plain JSON text; Apps-compatible hosts can also use
`structuredContent`.

<details>
<summary><strong>Catalog, plants and guides</strong></summary>

### `search_fish`

Purpose: search fish and aquatic animal profiles.

Prompt: "Find beginner-friendly small fish for a 90 L planted tank."

```json
{
  "query": "tetra",
  "language": "en",
  "min_tank_liters": 40,
  "max_tank_liters": 120,
  "limit": 5
}
```

Output: matching public animal profiles with slugs, localized names, summary
fields and public URLs when available.

### `get_fish_profile`

Purpose: retrieve one structured fish or aquatic animal profile.

Prompt: "Show me the Atlarium profile for Neon Tetra."

```json
{
  "slug": "paracheirodon-innesi",
  "language": "en"
}
```

Output: public profile data, care parameters, taxonomy, relationships and
localized content where available.

### `search_plants`

Purpose: search aquatic plant profiles.

Prompt: "Find easy foreground or midground plants for low-tech tanks."

```json
{
  "query": "anubias",
  "language": "en",
  "difficulty": "easy",
  "limit": 5
}
```

Output: matching public plant profiles with placement, difficulty and public
URLs when available.

### `get_plant_profile`

Purpose: retrieve one structured aquatic plant profile.

Prompt: "Open the plant profile for Anubias barteri."

```json
{
  "slug": "anubias-barteri",
  "language": "en"
}
```

Output: plant requirements, growth information, structured attributes and
localized content where available.

### `search_products`

Purpose: search public habitat products.

Prompt: "Find filter products for freshwater tanks."

```json
{
  "query": "filter",
  "language": "en",
  "category": "filter",
  "limit": 5
}
```

Output: product results with brand/category information and public product URLs
when available.

### `get_product_profile`

Purpose: retrieve a public product profile.

Prompt: "Show the product profile for this catalog slug."

```json
{
  "slug": "seachem/prime",
  "language": "en"
}
```

Output: structured public product data, use cases, brand details and links when
available.

### `search_guides`

Purpose: search Atlarium guides and educational content.

Prompt: "Find public guides about cycling an aquarium."

```json
{
  "query": "cycling",
  "language": "en",
  "topic": "aquarium",
  "limit": 5
}
```

Output: guide matches with title, summary, topic and public URLs when
available.

### `get_guide`

Purpose: retrieve one public Atlarium guide.

Prompt: "Open the nitrogen cycle guide."

```json
{
  "slug": "aquarium/nitrogen-cycle",
  "language": "en"
}
```

Output: structured public guide content and related metadata.

</details>

<details>
<summary><strong>Diagnostics and treatment references</strong></summary>

### `search_algae`

Purpose: search algae diagnostic profiles.

Prompt: "Find algae profiles for green dust on aquarium glass."

```json
{
  "query": "green dust",
  "language": "en",
  "difficulty": 2,
  "limit": 5
}
```

Output: algae matches with symptoms, likely causes and advisory guidance.

### `get_algae_profile`

Purpose: retrieve one algae profile.

Prompt: "Show the profile for green spot algae."

```json
{
  "slug": "green-spot-algae",
  "language": "en"
}
```

Output: structured public algae profile with symptoms, causes, prevention and
advisory response.

### `search_diseases`

Purpose: search aquatic disease profiles.

Prompt: "Find disease profiles for white spots on fish."

```json
{
  "query": "white spots",
  "language": "en",
  "water_type": "freshwater",
  "limit": 5
}
```

Output: possible disease profiles and advisory treatment references.

### `get_disease_profile`

Purpose: retrieve one disease profile.

Prompt: "Open the ich disease profile."

```json
{
  "slug": "ich",
  "language": "en"
}
```

Output: symptoms, possible causes, treatment references and disclaimers.

### `search_plant_problems`

Purpose: search aquatic plant deficiency, pest and environment profiles.

Prompt: "Find causes for yellowing leaves in aquarium plants."

```json
{
  "query": "yellow leaves",
  "language": "en",
  "type": "deficiency",
  "limit": 5
}
```

Output: plant problem matches with symptoms, causes and advisory corrections.

### `get_plant_problem_profile`

Purpose: retrieve one plant problem profile.

Prompt: "Open the nitrogen deficiency profile."

```json
{
  "slug": "nitrogen-deficiency",
  "language": "en"
}
```

Output: structured deficiency/problem data and advisory guidance.

### `search_medicines`

Purpose: search aquarium medicine and treatment product profiles.

Prompt: "Find public medicine references for ich treatment."

```json
{
  "query": "ich",
  "language": "en",
  "limit": 5
}
```

Output: medicine/treatment references with public profile data where available.

### `get_medicine_profile`

Purpose: retrieve one medicine profile.

Prompt: "Open the profile for a medicine slug."

```json
{
  "slug": "malachite-green",
  "language": "en"
}
```

Output: structured public medicine reference, use notes and disclaimers.

### `match_diagnostic_profiles`

Purpose: match symptom text across algae, disease, plant problem and medicine
profiles.

Prompt: "Match fuzzy white growth on driftwood and stressed fish symptoms."

```json
{
  "query": "white fuzzy growth and fish flashing",
  "language": "en",
  "limit": 8
}
```

Output: likely public diagnostic profiles grouped by relevance.

</details>

<details>
<summary><strong>Products, equipment and fertilizers</strong></summary>

### `list_product_categories`

Purpose: list product categories for equipment and fertilizers.

Prompt: "Which public equipment categories are available?"

```json
{
  "language": "en",
  "type": "equipment"
}
```

Output: localized public category names and identifiers.

### `list_product_brands`

Purpose: list public product brands.

Prompt: "List brands matching Seachem."

```json
{
  "language": "en",
  "query": "Seachem"
}
```

Output: matching public brand names and metadata.

### `search_equipment`

Purpose: search aquarium and habitat equipment products.

Prompt: "Find heaters for a freshwater setup."

```json
{
  "query": "heater",
  "language": "en",
  "use_case": "freshwater",
  "limit": 5
}
```

Output: equipment product matches with structured public catalog fields.

### `get_equipment_profile`

Purpose: retrieve one equipment product profile.

Prompt: "Open this equipment profile."

```json
{
  "slug": "eheim/thermocontrol",
  "language": "en"
}
```

Output: public equipment details, category, brand and usage fields when
available.

### `search_fertilizers`

Purpose: search fertilizer products and nutrient profiles.

Prompt: "Find liquid fertilizers for planted aquariums."

```json
{
  "query": "flourish",
  "language": "en",
  "category": "fertilizer",
  "limit": 5
}
```

Output: fertilizer product matches and nutrient metadata when available.

### `get_fertilizer_profile`

Purpose: retrieve one fertilizer profile.

Prompt: "Open this fertilizer profile."

```json
{
  "slug": "seachem/flourish",
  "language": "en"
}
```

Output: structured fertilizer data, dosing metadata and public catalog details
when available.

</details>

<details>
<summary><strong>Compatibility, water and habitat suggestions</strong></summary>

### `check_species_compatibility`

Purpose: check basic compatibility among habitat species.

Prompt: "Can Neon Tetra and Corydoras paleatus work in a 90 L planted tank?"

```json
{
  "species": ["Paracheirodon innesi", "Corydoras paleatus"],
  "language": "en",
  "tank_liters": 90,
  "ph": 6.8,
  "temperature": 24
}
```

Output: advisory compatibility signals, warnings, rationale and constraints.

### `get_water_parameters`

Purpose: retrieve recommended water parameters for a fish or plant.

Prompt: "What water parameters does Neon Tetra prefer?"

```json
{
  "slug": "paracheirodon-innesi",
  "type": "fish",
  "language": "en"
}
```

Output: public temperature, pH, GH/KH and related parameter guidance where
available.

### `suggest_species_for_tank`

Purpose: suggest aquatic species based on tank and water parameters.

Prompt: "Suggest beginner-friendly species for a 120 L planted tank."

```json
{
  "tank_liters": 120,
  "language": "en",
  "ph": 6.8,
  "temperature": 24,
  "beginner_friendly": true,
  "planted_tank": true,
  "limit": 8
}
```

Output: public species suggestions with warnings and basic rationale.

### `suggest_habitat_for_tank`

Purpose: suggest a complete public habitat plan.

Prompt: "Plan a balanced planted community habitat for 120 L."

```json
{
  "tank_liters": 120,
  "language": "en",
  "ph": 6.8,
  "temperature": 24,
  "beginner_friendly": true,
  "planted_tank": true,
  "co2": "low",
  "light_level": "medium",
  "setup_intent": "community",
  "target_difficulty": "balanced",
  "water_type": "FRESHWATER",
  "limit": 8
}
```

Output: fish, invertebrates, plants, products, warnings, motivations, related
guides and advisory disclaimer.

</details>

<details>
<summary><strong>Fertilization</strong></summary>

### `search_fertilization_regimes`

Purpose: search fertilization regimes and dosing philosophies.

Prompt: "Find regimes for low-tech planted tanks."

```json
{
  "query": "low tech",
  "language": "en",
  "topic": "planted",
  "limit": 5
}
```

Output: public regime matches with summary, topics and public URLs when
available.

### `get_fertilization_regime`

Purpose: retrieve one fertilization regime.

Prompt: "Open the Estimative Index regime profile."

```json
{
  "slug": "estimative-index",
  "language": "en"
}
```

Output: structured public dosing philosophy/regime details.

### `calculate_fertilizer_dose`

Purpose: calculate an advisory fertilizer dose for a catalog product and tank
volume.

Prompt: "Calculate the dose of Seachem Flourish for 120 L."

```json
{
  "brand_name": "Seachem",
  "product_name": "Flourish",
  "volume_liters": 120
}
```

Output: advisory dose estimate and product-related dosing context.

### `calculate_nutrient_gaps`

Purpose: compare nutrient measurements against targets.

Prompt: "Compare my nitrate and potassium readings with planted tank targets."

```json
{
  "language": "en",
  "volume_liters": 120,
  "measurements": [
    {
      "kind": "nitrogen_mg_l",
      "value": 5
    },
    {
      "kind": "potassium_mg_l",
      "value": 8
    }
  ],
  "targets": {
    "nitrogen_mg_l": 10,
    "potassium_mg_l": 15
  }
}
```

Output: nutrient gap estimates without saving measurements.

### `calculate_weekly_dose_totals`

Purpose: calculate weekly totals for a non-persistent dosing plan.

Prompt: "Add up my weekly liquid fertilizer plan."

```json
{
  "language": "en",
  "volume_liters": 120,
  "items": [
    {
      "brand_name": "Seachem",
      "product_name": "Flourish",
      "method": "LIQUID",
      "dose_value": 5,
      "dose_unit": "ml",
      "days_of_week": [1, 3, 5]
    }
  ]
}
```

Output: weekly product totals and schedule summary.

### `generate_fertilization_plan`

Purpose: generate an advisory non-persistent fertilization plan.

Prompt: "Generate a balanced planted tank fertilization plan for 120 L."

```json
{
  "language": "en",
  "volume_liters": 120,
  "regime": "balanced",
  "targets": {
    "nitrogen_mg_l": 10,
    "phosphorus_mg_l": 1,
    "potassium_mg_l": 15,
    "iron_mg_l": 0.1
  }
}
```

Output: advisory plan, nutrient targets, product suggestions and disclaimer.

</details>

<details>
<summary><strong>Calculators</strong></summary>

### `calculate_tank_volume`

Purpose: calculate gross and net aquarium volume estimates.

Prompt: "Calculate net volume for a 60 x 30 x 36 cm tank."

```json
{
  "shape": "rect",
  "length_cm": 60,
  "width_cm": 30,
  "height_cm": 36,
  "substrate_depth_cm": 5,
  "hardscape_displacement_liters": 4
}
```

Output: gross and net volume estimates.

### `calculate_tank_weight`

Purpose: estimate aquarium weight from dimensions and material inputs.

Prompt: "Estimate the filled weight of a 120 L aquarium."

```json
{
  "shape": "rect",
  "length_cm": 80,
  "width_cm": 35,
  "height_cm": 45,
  "glass_thickness_mm": 8,
  "substrate_depth_cm": 6,
  "hardscape_weight_kg": 12,
  "equipment_weight_kg": 5
}
```

Output: advisory total weight estimate and component breakdown.

### `calculate_water_change`

Purpose: calculate water change volume, weekly totals and dilution estimates.

Prompt: "How much water is a 30 percent change on 120 L twice per week?"

```json
{
  "volume_liters": 120,
  "change_percent": 30,
  "changes_per_week": 2
}
```

Output: per-change volume and weekly total estimates.

### `calculate_water_chemistry`

Purpose: calculate hardness conversions, CO2, salinity and water mixing.

Prompt: "Estimate CO2 from pH 6.8 and KH 4."

```json
{
  "co2": {
    "ph": 6.8,
    "kh_dkh": 4
  },
  "general_hardness": {
    "unit": "dgh",
    "value": 8
  }
}
```

Output: public chemistry conversions and advisory estimates.

### `convert_units`

Purpose: convert aquarium-relevant units.

Prompt: "Convert 120 liters and 24 C."

```json
{
  "volume": {
    "unit": "l",
    "value": 120
  },
  "temperature": {
    "unit": "c",
    "value": 24
  }
}
```

Output: converted values for supported units.

### `calculate_equipment_requirements`

Purpose: calculate advisory heater, lighting and electricity requirements.

Prompt: "Estimate heater and lighting needs for a 120 L aquarium."

```json
{
  "heater": {
    "volume_liters": 120,
    "ambient_c": 20,
    "target_c": 25,
    "insulation": "normal"
  },
  "lighting": {
    "volume_liters": 120,
    "lumens": 3600
  },
  "electricity": {
    "wattage": 100,
    "hours_per_day": 8,
    "cost_per_kwh": 0.25
  }
}
```

Output: advisory equipment estimates and electricity usage/cost summary.

</details>

## Discovery And Directory Status

| Directory | Status |
| --- | --- |
| Official MCP Registry | Published as `bio.atlarium/habitat-database`; publish the V2 `server.json` update after coordinated endpoint validation. |
| Glama | Ownership verified; listing healthy with 39 tools and canonical V2 description. |
| Smithery | Published and visible at `ilgrafico79/atlarium-habitat-database`; latest release `SUCCESS`, quality score `88/100`, parameter descriptions `39/39`; custom server-icon upload remains an optional score optimization. |
| MCP.so | Submitted through the public GitHub issue flow; no public listing badge yet. |
| PulseMCP | Listed publicly; verify badge policy before adding a badge. |
| ChatGPT App | Submitted / in review; no public approval claim yet. |

Publication tracking and reusable submission copy live in
`docs/publication-checklist.md`, `docs/directory-submission-payloads.md` and
`docs/mcp-submission-cockpit.md`.

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
- `OPENAI_APPS_CHALLENGE_TOKEN`: public OpenAI Apps domain verification token served from `/.well-known/openai-apps-challenge`.

Production deployments must run behind a TLS-terminating reverse proxy or
Ingress that overwrites `X-Forwarded-For`, `X-Forwarded-Host` and
`X-Forwarded-Proto` before traffic reaches this server.

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
pnpm mcp:monitor:public
pnpm directories:submit -- --check
pnpm mcp:validate:public
pnpm mcp:conformance:public
```

## Contributing

See `CONTRIBUTING.md`. Public tool changes must update the server
implementation, tests, server-card metadata, `server.json`, `README.md`,
`docs/mcp.md`, docs, examples and directory publication notes in the same
release.

## Security

See `SECURITY.md`. Do not report sensitive security issues in public GitHub
issues.

## License

MIT. See `LICENSE`.
