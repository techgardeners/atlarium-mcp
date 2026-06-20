# ChatGPT Apps Submission Notes

Last reviewed: 2026-06-20

Connector URL:

```text
https://mcp.atlarium.bio/mcp
```

Use this when preparing a ChatGPT Apps or connector submission. Do not claim
public ChatGPT availability until review is complete.

This package covers the implemented Habitat Explorer widget, submission
metadata, tests, screenshots and safety notes. Public ChatGPT availability still
depends on OpenAI review.

## App Surface

- App type: MCP Apps / ChatGPT Apps connector with a widget UI.
- Widget name: Atlarium Habitat Explorer.
- Widget resource URI: `ui://widget/habitat-explorer.v3.html`.
- Widget MIME type: `text/html;profile=mcp-app`.
- Widget domain: `https://mcp.atlarium.bio` through `_meta.ui.domain` and
  `_meta["openai/widgetDomain"]`.
- Widget source: `src/apps/habitat-explorer.ts`.
- Widget visual treatment: self-contained Atlarium-native UI using inline brand
  colors and embedded JPEG logo data URIs for light and dark surfaces. Optional
  species media is rendered only from structured tool payloads when the image is
  a data URI or an approved HTTPS Atlarium URL; no arbitrary remote assets,
  fonts, scripts, fetches or iframes.
- Widget localization: UI labels and status messages localize to English,
  Italian or Spanish from host/browser locale; technical tool keys should not be
  shown as user-facing status text.
- Tool metadata: `_meta.ui.resourceUri` plus the ChatGPT compatibility alias
  `_meta["openai/outputTemplate"]`.
- Safety: public, read-only, auth `none`, no user/workspace/admin/write tools.

## Required Review Assets

- App name: `Atlarium Habitat Database MCP`
- Short description: `Structured aquarium, marine, terrarium and paludarium data for AI agents.`
- Long description: `Atlarium MCP is a public read-only MCP server that gives AI agents structured access to data and advisory functions for aquariums, marine tanks, coldwater systems, terrariums, paludariums and vivariums. It includes animals, plants, products, guides, algae, diseases, plant problems, medicines, compatibility, fertilization, habitat planning and public aquarium calculators.`
- Widget description: interactive read-only habitat cards for species, plants, diagnostics, products, calculators, fertilization, compatibility and tank suggestions.
- Docs: `https://atlarium.bio/mcp`
- Server card: `https://mcp.atlarium.bio/.well-known/mcp/server-card.json`
- Repository: `https://github.com/techgardeners/atlarium-mcp`
- Official MCP Registry name: `bio.atlarium/habitat-database`
- Transport: Streamable HTTP
- Authentication: none
- Tool count: 39
- Tool safety: read-only tools only; no write, workspace, auth, user or admin APIs.
- Company / publisher: TechGardeners, `info@techgardeners.com`
- App icon asset: `docs/assets/chatgpt-app-icon.png`, a 1024x1024 Atlarium
  habitat mark suitable for the ChatGPT app launcher and review form.
- Public brand logo reference: `/images/brand/atlarium-logo.png` on
  `https://atlarium.bio`.
- Privacy URL: `https://atlarium.bio/privacy` is live and includes MCP /
  ChatGPT App data-access notes. `https://atlarium.bio/en/privacy` also returns
  HTTP 200.
- Screenshots showing connection, tool discovery, widget rendering and sample tool responses.

## OpenAI Review Notes

- The app/connector metadata snapshot is captured when the draft MCP endpoint is scanned in the OpenAI Platform Dashboard. Rescan after deploying any tool metadata, schema, resource or instruction change before submitting.
- In ChatGPT web Developer Mode, connector metadata can remain cached after a
  widget URI change. Open Settings -> Apps, select the Atlarium draft app and
  click `Actualizar`; confirm the app detail shows the v3 output template before
  rerunning screenshots.
- A privacy policy must be published and explain personal data categories, purposes, recipients, retention and user controls.
- Keep public copy factual: do not claim public ChatGPT approval or availability until review is complete.

## Manual QA Snapshot

Verified in ChatGPT web Developer Mode on 2026-06-20 after refreshing metadata:

- 39 read-only Atlarium tools discovered.
- `search_fish` for `Paracheirodon innesi` rendered the Habitat Explorer v3
  Results widget with real Neon Tetra data and no sample fallback.
- `check_species_compatibility` for `Corydoras paleatus` and `Betta splendens`
  rendered the Compatibility panel as compatible with caution.
- `suggest_species_for_tank` for a 120 L planted tank rendered the Suggestions
  panel and ChatGPT answered in Italian when requested.
- Private tank/journal write and admin/delete/private workspace injection prompts
  did not expose write tools.

## Safety Explanation

Atlarium Habitat Database MCP exposes public, read-only habitat reference data.
It does not expose Atlarium accounts, private workspaces, journals, schedules,
measurements, admin APIs, authentication APIs or write operations. Compatibility
checks and tank suggestions are advisory and should be validated against real
livestock, equipment, water chemistry and local husbandry constraints.

## Screenshot Checklist

- ChatGPT connector creation with `https://mcp.atlarium.bio/mcp`.
- Refreshed connector metadata showing the Atlarium tools.
- Endpoint scan showing the 39 expected read-only tools.
- Habitat Explorer Results view rendering a fish search result.
- Habitat Explorer Results view with species thumbnails when image fields are
  present in the tool payload.
- Habitat Explorer Profile view rendering a fish or plant profile with detail
  media when available.
- Habitat Explorer Compatibility view rendering warnings, recommended actions
  and reviewed species with media thumbnails for a community pair.
- Habitat Explorer Suggestions view rendering tank suggestions and readable
  reason chips with media for a planted freshwater aquarium.
- Habitat Explorer Diagnostics view rendering algae, disease, plant problem or
  medicine results from public tool output.
- Habitat Explorer Product/Fertilization view rendering public equipment,
  fertilizer, fertilization regime or dose-plan output.
- Habitat Explorer Calculator view rendering volume, weight, water chemistry,
  unit conversion or equipment requirement output.
- Visual QA captures for Results, Profile, Compatibility and Suggestions in
  light mode, dark mode and a narrow mobile viewport.
- Localization QA capture with Italian locale, confirming translated labels and
  no raw tool keys in status messages.
- Safety/privacy notes visible in the submission form.
- Privacy policy URL resolving HTTP 200: `https://atlarium.bio/privacy`.

## Test Prompts

```text
Use Atlarium to compare neon tetra and harlequin rasbora care requirements for a planted community aquarium.
```

Expected response:

```text
Returns a care comparison grounded in public species data, including tank size,
temperature, pH/GH/KH ranges where available, temperament and schooling notes.
The response should call out that the result is advisory.
```

```text
Check whether Corydoras paleatus and Betta splendens are compatible, and explain the water parameter tradeoffs.
```

Expected response:

```text
Calls the compatibility tool with both species, summarizes compatibility signals
and explains any parameter or behavior tradeoffs without presenting the answer
as definitive husbandry advice.
```

```text
Suggest peaceful freshwater species for a 90 liter planted tank at 24 C with pH 6.8.
```

Expected response:

```text
Calls the tank suggestion tool with 90 liters, 24 C and pH 6.8, returns a short
ranked list of peaceful freshwater suggestions and includes the advisory safety
boundary.
```

```text
Use the Atlarium Habitat Explorer widget to show a profile card for Blue Acara and then inspect its water parameters.
```

Expected response:

```text
Retrieves the Blue Acara public profile, renders the habitat card when the
ChatGPT UI is available and summarizes water parameters from the tool result.
```

```text
Use Atlarium to suggest species for a 120 liter planted tank and show the suggestions as habitat cards.
```

Expected response:

```text
Calls `suggest_species_for_tank`, renders suggestion cards when the ChatGPT UI is
available and keeps the recommendations read-only and advisory.
```

```text
Find Atlarium guide data for nitrate and summarize what an aquarist should monitor.
```

Expected response:

```text
Searches or retrieves guide data for nitrate, summarizes monitoring guidance and
keeps the answer within public educational content.
```

```text
Use Atlarium to identify likely causes of black beard algae and summarize public treatment options.
```

Expected response:

```text
Calls `search_algae` and, where useful, `get_algae_profile`; summarizes causes,
treatments, prevention and an advisory diagnostic caveat.
```

```text
Generate an advisory fertilization plan for a 90 liter planted tank using public Atlarium catalog data.
```

Expected response:

```text
Uses fertilization regime/search/calculation tools, returns a non-persistent
plan, and states that dosing must be adjusted against measurements and livestock
safety.
```

```text
Calculate volume, estimated weight and weekly water-change amount for a 60 x 30 x 36 cm aquarium.
```

Expected response:

```text
Uses public calculator tools and reports assumptions plus the advisory safety
boundary for weight and water planning.
```

## Demo Script

1. Open the connector creation or draft app flow.
2. Enter connector URL `https://mcp.atlarium.bio/mcp`.
3. Scan the endpoint and confirm the 39 expected read-only tools appear.
4. Run the test prompts above and capture the tool call transcript.
5. Confirm the safety statement appears in the app listing/review notes.
6. Confirm the privacy policy URL is still live before submission.
7. After any UI-thread change deploys, rescan the endpoint before submission.
