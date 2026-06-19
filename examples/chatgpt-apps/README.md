# ChatGPT Apps Submission Notes

Last reviewed: 2026-06-19

Connector URL:

```text
https://mcp.atlarium.bio/mcp
```

Use this when preparing a ChatGPT Apps or connector submission. Do not claim
public ChatGPT availability until review is complete.

This package covers submission metadata, tests, screenshots and safety notes.
New ChatGPT App UI implementation remains owned by the main UI thread. Public
ChatGPT availability still depends on OpenAI review.

## App Surface

- App type: MCP Apps / ChatGPT Apps connector with a widget UI.
- Widget name: Atlarium Habitat Explorer.
- Widget resource URI: `ui://widget/habitat-explorer.v1.html`.
- Widget MIME type: `text/html;profile=mcp-app`.
- Tool metadata: `_meta.ui.resourceUri` plus the ChatGPT compatibility alias
  `_meta["openai/outputTemplate"]`.
- Safety: public, read-only, auth `none`, no user/workspace/admin/write tools.

## Required Review Assets

- App name: `Atlarium Habitat Database MCP`
- Short description: `Structured aquarium, marine, terrarium and paludarium data for AI agents.`
- Long description: `Atlarium MCP is a public read-only MCP server that gives AI agents structured access to data for aquariums, marine tanks, coldwater systems, terrariums, paludariums and vivariums. It includes animals, plants, products, care requirements, environmental parameters, compatibility information, guides and habitat planning tools.`
- Widget description: interactive read-only habitat cards for species, plants, compatibility and tank suggestions.
- Docs: `https://atlarium.bio/mcp`
- Server card: `https://mcp.atlarium.bio/.well-known/mcp/server-card.json`
- Repository: `https://github.com/techgardeners/atlarium-mcp`
- Official MCP Registry name: `bio.atlarium/habitat-database`
- Transport: Streamable HTTP
- Authentication: none
- Tool count: 11
- Tool safety: read-only tools only; no write, workspace, auth, user or admin APIs.
- Company / publisher: TechGardeners, `info@techgardeners.com`
- Logo asset requested: Atlarium brand logo, currently referenced by the public MCP docs as `/images/brand/atlarium-logo.png`.
- Privacy URL: blocker. `https://atlarium.bio/privacy` and `https://atlarium.bio/en/privacy` returned HTTP 404 during the 2026-06-19 check. A clear, published privacy policy URL is required before submission.
- Screenshots showing connection, tool discovery, widget rendering and sample tool responses.

## OpenAI Review Notes

- The app/connector metadata snapshot is captured when the draft MCP endpoint is scanned in the OpenAI Platform Dashboard. Rescan after deploying any tool metadata, schema, resource or instruction change before submitting.
- A privacy policy must be published and explain personal data categories, purposes, recipients, retention and user controls.
- Keep public copy factual: do not claim public ChatGPT approval or availability until review is complete.

## Safety Explanation

Atlarium Habitat Database MCP exposes public, read-only habitat reference data.
It does not expose Atlarium accounts, private workspaces, journals, schedules,
measurements, admin APIs, authentication APIs or write operations. Compatibility
checks and tank suggestions are advisory and should be validated against real
livestock, equipment, water chemistry and local husbandry constraints.

## Screenshot Checklist

- ChatGPT connector creation with `https://mcp.atlarium.bio/mcp`.
- Refreshed connector metadata showing the Atlarium tools.
- Endpoint scan showing the 11 expected read-only tools.
- Habitat Explorer widget rendering a fish search result, after the UI thread is ready.
- Habitat Explorer widget rendering a fish or plant profile, after the UI thread is ready.
- Compatibility panel for a community species pair, after the UI thread is ready.
- Tank suggestion panel for a planted freshwater aquarium, after the UI thread is ready.
- Safety/privacy notes visible in the submission form.
- Privacy policy URL resolving HTTP 200.

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

## Demo Script

1. Open the connector creation or draft app flow.
2. Enter connector URL `https://mcp.atlarium.bio/mcp`.
3. Scan the endpoint and confirm the 11 expected read-only tools appear.
4. Run the test prompts above and capture the tool call transcript.
5. Confirm the safety statement appears in the app listing/review notes.
6. Confirm the privacy policy URL is live before submission.
7. After any UI-thread change deploys, rescan the endpoint before submission.
