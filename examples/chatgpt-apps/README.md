# ChatGPT Apps Submission Notes

Last reviewed: 2026-07-02

Connector URL:

```text
https://mcp.atlarium.bio/mcp
```

Use this as the ChatGPT Apps resubmission package record. Do not claim public
ChatGPT availability until review is accepted.

This package covers the implemented Habitat Explorer widget, submission
metadata, tests, screenshots and safety notes. Public ChatGPT availability still
depends on OpenAI review.

Current review status: `not approved / fixes deployed / pending dashboard resubmission`.
See `docs/chatgpt-review-remediation.md` for the rejection remediation record,
validation command and screenshot replacement checklist.

## App Surface

- App type: MCP Apps / ChatGPT Apps connector with a widget UI.
- Widget name: Atlarium Habitat Explorer.
- Widget resource URI: `ui://widget/habitat-explorer.v3.html`.
- Legacy widget resource aliases `ui://widget/habitat-explorer.v2.html` and
  `ui://widget/habitat-explorer.v1.html` are also served for ChatGPT metadata
  caches that still point at an older output template.
- Widget MIME type: `text/html;profile=mcp-app`.
- Widget domain: `https://mcp.atlarium.bio` through `_meta.ui.domain` and
  `_meta["openai/widgetDomain"]`.
- Widget source: `src/apps/habitat-explorer.ts`.
- Widget visual treatment: self-contained Atlarium Habitat OS Pro UI with dark
  premium surfaces, a desktop icon rail, dense searchable results, large habitat
  media and a technical inspector panel. It uses inline brand colors and
  embedded JPEG logo data URIs; optional species media is rendered only from
  structured tool payloads when the image is a data URI or an approved HTTPS
  Atlarium URL; no arbitrary remote assets, fonts, scripts, fetches or iframes.
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
- OpenAI Apps challenge:
  `https://mcp.atlarium.bio/.well-known/openai-apps-challenge`.
- New screenshots must show the real in-ChatGPT web/mobile app experience,
  including tool calls and widget/text output. The widget-only PNGs in
  `docs/assets/chatgpt-screenshots/` are development evidence and must not be
  reused as publishing screenshots.

## OpenAI Review Notes

- The app/connector metadata snapshot is captured when the draft MCP endpoint is scanned in the OpenAI Platform Dashboard. After any tool metadata, schema, resource or instruction change, redeploy, rescan the endpoint and respond in the review portal if OpenAI requested the change.
- In ChatGPT web Developer Mode, connector metadata can remain cached after a
  widget URI change. Open Settings -> Apps, select the Atlarium draft app and
  click `Actualizar`; confirm the app detail shows the v3 output template before
  rerunning screenshots. The server still serves v2/v1 aliases, but refreshing
  metadata is the preferred review path.
- A privacy policy must be published and explain personal data categories, purposes, recipients, retention and user controls.
- Keep public copy factual: do not claim public ChatGPT approval or availability until review is complete.

## Manual QA Snapshot

Verified in ChatGPT web Developer Mode on 2026-06-20 after refreshing metadata.
Re-run these checks on web and mobile after the 2026-07-02 remediation deploy:

- 39 read-only Atlarium tools discovered.
- `search_fish` for `Paracheirodon innesi` rendered the Habitat Explorer v3
  Results widget with real Neon Tetra data and no sample fallback.
- `check_species_compatibility` for `Corydoras paleatus` and `Betta splendens`
  rendered the Compatibility panel as compatible with caution.
- `suggest_species_for_tank` for a 120 L planted tank rendered the Suggestions
  panel in English for directory screenshots; keep Italian as separate locale
  QA only.
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
  present in the tool payload and the desktop icon rail contains no visible
  placeholder letters.
- Habitat Explorer Profile view rendering a fish or plant profile with detail
  media and a technical inspector panel when available.
- Habitat Explorer Compatibility view rendering English warnings, recommended
  actions and reviewed species with media thumbnails for a community pair.
- Habitat Explorer Suggestions view rendering English tank suggestions and
  readable reason chips with media for a planted freshwater aquarium.
- Habitat Explorer Diagnostics view rendering algae, disease, plant problem or
  medicine results from public tool output.
- Habitat Explorer Product/Fertilization view rendering public equipment,
  fertilizer, fertilization regime or dose-plan output.
- Habitat Explorer Calculator view rendering volume, weight, water chemistry,
  unit conversion or equipment requirement output.
- Publishing captures for Results, Profile, Compatibility and Suggestions in
  ChatGPT web and mobile. Captures must include the ChatGPT host UI, not only
  the embedded widget.
- Localization QA capture with Italian locale, confirming translated labels and
  no raw tool keys in status messages.
- Safety/privacy notes visible in the submission form.
- Privacy policy URL resolving HTTP 200: `https://atlarium.bio/privacy`.

## Test Prompts

```text
Use Atlarium to search fish records for "neon tetra" and return the top public match only.
```

Expected response:

```text
The top Atlarium fish result is Neon Tetra (Paracheirodon innesi), not
Angelfish. The response is based on public data and performs no write action.
```

```text
Check whether Corydoras paleatus and Betta splendens are compatible in a 90 liter planted tank at 24 C and pH 6.8.
```

Expected response:

```text
Calls `check_species_compatibility`, returns compatible with caution, includes
both species and recommends monitoring behavior and water parameters.
```

```text
Use Atlarium to suggest beginner-friendly peaceful species for a 90 liter planted freshwater tank at 24 C and pH 6.8.
```

Expected response:

```text
Calls `suggest_species_for_tank`, returns public species suggestions with
reasons or matching water ranges, and does not save a tank profile.
```

```text
Use Atlarium to search guide records for "nitrate" and return the top public guide match only.
```

Expected response:

```text
Calls `search_guides`. The top Atlarium guide result is Nitrate / NO3, not
Nitrite / NO2, and the response summarizes public educational guidance only.
```

```text
Use Atlarium to calculate the aquarium volume for a rectangular 60 x 30 x 36 cm tank.
```

Expected response:

```text
Calls `calculate_tank_volume` and returns gross/net volume of about 64.8 liters
with advisory calculator wording.
```

## Demo Script

1. Open the connector creation or draft app flow.
2. Enter connector URL `https://mcp.atlarium.bio/mcp`.
3. Scan the endpoint and confirm the 39 expected read-only tools appear.
4. Run the test prompts above and capture the tool call transcript.
5. Confirm the safety statement appears in the app listing/review notes.
6. Confirm the privacy policy URL is still live before any review response.
7. Run `pnpm chatgpt:validate-submission` against production.
8. After any UI-thread change deploys, rescan the endpoint before resubmitting
   in the OpenAI review portal.
