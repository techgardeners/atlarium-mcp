# ChatGPT Apps Submission Notes

Last reviewed: 2026-08-16

Connector URL:

```text
https://mcp.atlarium.bio/mcp
```

Use this as the ChatGPT Apps resubmission package record. Do not claim public
ChatGPT availability until review is accepted.

This package covers the implemented Habitat Explorer widget, submission
metadata, tests, screenshots and safety notes. Public ChatGPT availability still
depends on OpenAI review.

Current review status: existing App `1.0.0` approved; version `2.0.2` draft
saved, domain verified and 39-tool endpoint rescan complete; asset upload,
native mobile recording and final submission pending. See
`docs/chatgpt-review-remediation.md` for the remediation record and remaining
review checklist.

## App Surface

- App type: MCP Apps / ChatGPT Apps connector with a widget UI.
- Widget name: Atlarium Habitat Explorer.
- Widget resource URI: `ui://widget/habitat-explorer.v4.html`.
- Legacy widget resource aliases `ui://widget/habitat-explorer.v3.html`,
  `ui://widget/habitat-explorer.v2.html` and
  `ui://widget/habitat-explorer.v1.html` are also served for ChatGPT metadata
  caches that still point at an older output template.
- Widget MIME type: `text/html;profile=mcp-app`.
- Widget domain: `https://mcp.atlarium.bio` through `_meta.ui.domain` and
  `_meta["openai/widgetDomain"]`.
- Widget source: `src/apps/habitat-explorer.ts`.
- Widget visual treatment: self-contained React 19 Habitat Explorer v4 with
  native ChatGPT surfaces, real Atlarium species/product media, compact result
  carousels and readable editorial chapter hierarchy. Mascot cutouts appear on
  the left only in loading, empty and error states. There is no internal rail,
  dashboard chrome, invented result media or duplicated app branding.
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
- Company / publisher: Tech Gardeners SA.
- App icon asset: `docs/assets/chatgpt-app-icon.png`, a 1024x1024 Atlarium
  habitat mark suitable for the ChatGPT app launcher and review form.
- Public brand logo reference: `/images/brand/atlarium-logo.png` on
  `https://atlarium.bio`.
- Privacy URL: `https://atlarium.bio/privacy` is live and includes MCP /
  ChatGPT App data-access notes. `https://atlarium.bio/en/privacy` also returns
  HTTP 200.
- OpenAI Apps challenge:
  `https://mcp.atlarium.bio/.well-known/openai-apps-challenge`.
- Real host-level web and responsive 390x844 screenshots are stored in
  `docs/assets/chatgpt-screenshots/real-host/`. Native mobile recording remains
  required. The widget-only fixtures directly under
  `docs/assets/chatgpt-screenshots/` are development evidence and must not be
  reused as publishing screenshots.

## OpenAI Review Notes

- The app/connector metadata snapshot is captured when the draft MCP endpoint is scanned in the OpenAI Platform Dashboard. After any tool metadata, schema, resource or instruction change, redeploy, rescan the endpoint and respond in the review portal if OpenAI requested the change.
- In ChatGPT web Developer Mode, connector metadata can remain cached after a
  widget URI change. Open Settings -> Apps, select the Atlarium draft app and
  click `Actualizar`; confirm the app detail shows the v4 output template before
  rerunning screenshots. The server still serves v3/v2/v1 aliases, but refreshing
  metadata is the preferred review path.
- A privacy policy must be published and explain personal data categories, purposes, recipients, retention and user controls.
- Keep public copy factual: do not claim public ChatGPT approval or availability until review is complete.

## Manual QA Snapshot

Verified in signed-in ChatGPT web on `2026-08-16` against production `2.0.2`:

- The OpenAI Platform draft endpoint rescan discovered 39 read-only Atlarium
  tools and domain verification passed.
- Direct `search_fish` for Neon Tetra rendered Habitat Explorer v4 with real
  species images and Neon Tetra as the top result.
- Direct `get_fish_profile` rendered the real Neon Tetra image, four primary
  metrics and the localized editorial chapter hierarchy.
- Web and responsive 390x844 host captures are checked in under
  `docs/assets/chatgpt-screenshots/real-host/`.
- `check_species_compatibility` for `Corydoras paleatus` and `Betta splendens`
  remains a required final host capture.
- `suggest_species_for_tank` for a 120 L planted tank rendered the Suggestions
  view in deterministic widget QA and remains a required final host capture.
- Private tank/journal write and admin/delete/private workspace injection prompts
  pass deterministic submission validation and remain a required host capture.

The first combined natural-language web run invoked search and profile in one
turn. Search rendered, while ChatGPT displayed one `Failed to fetch template`
notice for the concurrent profile render. The subsequent direct profile call
rendered successfully and production logs reported zero request/tool errors.
The cause is not determined; repeat the combined case after refreshing the
draft metadata and stop submission if it recurs.

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
- Habitat Explorer Results view with real species thumbnails when trusted media
  is present in the tool payload; no mascot replaces result media.
- Habitat Explorer Profile view rendering a fish or plant profile with real
  media, four priority metrics and distinct editorial chapter headings.
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
  ChatGPT web and native mobile. Search/profile web plus one responsive mobile
  viewport are present; compatibility, suggestions, negative and native mobile
  evidence remain. Captures must include the ChatGPT host UI.
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
