# ChatGPT Apps Submission Notes

Connector URL:

```text
https://mcp.atlarium.bio/mcp
```

Use this when preparing a ChatGPT Apps or connector submission. Do not claim
public ChatGPT availability until review is complete.

## App Surface

- App type: MCP Apps / ChatGPT Apps connector with a widget UI.
- Widget name: Atlarium Habitat Explorer.
- Widget resource URI: `ui://widget/habitat-explorer.v1.html`.
- Widget MIME type: `text/html;profile=mcp-app`.
- Tool metadata: `_meta.ui.resourceUri` plus the ChatGPT compatibility alias
  `_meta["openai/outputTemplate"]`.
- Safety: public, read-only, auth `none`, no user/workspace/admin/write tools.

## Required Review Assets

- app name: Atlarium Habitat Database MCP
- short description: Structured aquarium, marine, terrarium and paludarium data for AI agents.
- widget description: Interactive read-only habitat cards for species, plants, compatibility and tank suggestions.
- docs: https://atlarium.bio/mcp
- server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
- repository: https://github.com/techgardeners/atlarium-mcp
- privacy and company information from Atlarium public site
- screenshots showing connection, tool discovery, widget rendering and sample tool responses

## Screenshot Checklist

- ChatGPT connector creation with `https://mcp.atlarium.bio/mcp`.
- Refreshed connector metadata showing the Atlarium tools.
- Habitat Explorer widget rendering a fish search result.
- Habitat Explorer widget rendering a fish or plant profile.
- Compatibility panel for a community species pair.
- Tank suggestion panel for a planted freshwater aquarium.

## Test Prompts

```text
Use Atlarium to compare neon tetra and harlequin rasbora care requirements for a planted community aquarium.
```

```text
Check whether Corydoras paleatus and Betta splendens are compatible, and explain the water parameter tradeoffs.
```

```text
Suggest peaceful freshwater species for a 90 liter planted tank at 24 C with pH 6.8.
```

```text
Use the Atlarium Habitat Explorer widget to show a profile card for Blue Acara and then inspect its water parameters.
```

```text
Use Atlarium to suggest species for a 120 liter planted tank and show the suggestions as habitat cards.
```
