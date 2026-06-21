# Atlarium MCP Submission Cockpit

Last updated: `2026-06-20`

Use this cockpit when completing external MCP directory, claim and review flows.
It is MCP-only: no general Atlarium marketing, creator outreach or non-MCP
launch channels belong here.

## Canonical Assets

| Asset | Value |
| --- | --- |
| Name | `Atlarium Habitat Database MCP` |
| Endpoint | `https://mcp.atlarium.bio/mcp` |
| Transport | Streamable HTTP |
| Auth | none |
| Version | `2.0.0` |
| Tool surface | 39 public read-only tools |
| Prompts | 9 public guided prompts |
| Widget | `ui://widget/habitat-explorer.v3.html` |
| Server card | `https://mcp.atlarium.bio/.well-known/mcp/server-card.json` |
| OpenAI challenge | `https://mcp.atlarium.bio/.well-known/openai-apps-challenge` |
| Glama claim | `https://mcp.atlarium.bio/.well-known/glama.json` |
| Docs | `https://atlarium.bio/mcp` |
| Repo | `https://github.com/techgardeners/atlarium-mcp` |
| Demo video | `docs/assets/chatgpt-app-demo.mp4` |
| App icon | `docs/assets/chatgpt-app-icon.png` |
| Screenshots | `docs/assets/chatgpt-screenshots/` |

Safety copy:

```text
Atlarium Habitat Database MCP is read-only. It does not expose user accounts,
workspaces, admin APIs, private data or write operations.
```

## Status Board

| Surface | URL | Status | Codex can do alone | User/account needed | Payload / file | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Official MCP Registry | https://registry.modelcontextprotocol.io/v0.1/servers?search=bio.atlarium%2Fhabitat-database | Published / active; verify V2 metadata before claiming any refreshed registry copy | Validate endpoint and prepare `server.json` | DNS/GitHub publisher login only if a republish is required | `server.json`, `docs/directory-submission-payloads.md` | Run public checks before any future registry publish. |
| ChatGPT App | OpenAI Platform Apps review portal | Submitted / in review | Keep code, docs, challenge endpoint and submission JSON ready; monitor public endpoints | OpenAI account for review replies, portal state and final acceptance | `chatgpt-app-submission.json`, `examples/chatgpt-apps/README.md`, `docs/assets/` | Monitor review. If OpenAI requests changes, patch server/docs, redeploy, rescan and reply. |
| Glama | https://glama.ai/mcp/connectors/bio.atlarium/habitat-database | Ownership verified / listing healthy | Monitor listing health, analytics and tool quality score | None for ownership; account needed only for future edits | `https://mcp.atlarium.bio/.well-known/glama.json` | Keep accepted; add badge/link only if badge policy is approved. |
| Smithery | https://smithery.ai/servers/ilgrafico79/atlarium-habitat-database | Published / visible; score `96/100`; technical checks pass | Keep release metadata healthy; monitor score after metadata changes | Paid developer plan required for full Smithery verified status | `tmp/directory-submissions/secondary-directory-payloads.md` after `pnpm directories:submit -- --payload` | Smithery marks release, quality, homepage, TXT and backlink checks as passing; keep it unbadged unless the paid-plan verification requirement is satisfied. |
| MCP.so | https://mcp.so/server/atlarium-habitat-database-mcp | Listed / visible; dashboard ownership mismatch | Monitor listing metadata and slug; request account linkage only if edits are needed | None for visibility; `my-servers` currently shows `No servers` for Roberto ilGrafico / `ilgrafico79@gmail.com` | `tmp/directory-submissions/mcp-so-comment.md` | Public page returns HTTP 200 with Atlarium title, description and repository link. Old candidate slug `atlarium-habitat-database` still returns `Project not found`; use the `atlarium-habitat-database-mcp` URL as canonical public evidence. |
| PulseMCP | https://www.pulsemcp.com/servers/techgardeners-atlarium-habitat-database | Listed / visible | Monitor listing and registry sync | None unless correction request is needed | `tmp/directory-submissions/pulsemcp-email.md` | Keep visible as accepted; add badges only after deciding badge policy. |
| MCP Scoreboard | https://www.mcpscoreboard.com/server/8fb9547d-bdb4-4fab-8218-ef13c1be32fc/ | Listed / unscored | Verify listing and draft scoring request | GitHub owner verification for scoring | `docs/directory-submission-payloads.md` | Request scoring only if owner verification is worth the time; no score badge while unscored. |
| mcpservers.org | https://mcpservers.org/servers/techgardeners/atlarium-mcp | Listed / visible | Monitor listing metadata after server-card or README changes | None for visibility | `tmp/directory-submissions/secondary-directory-payloads.md` | Public page returns HTTP 200 with Atlarium title, canonical endpoint, repository, docs, server card and 39-tool read-only surface. Add badges only after badge policy approval. |
| MCPRepository | https://mcprepository.com/techgardeners/atlarium-mcp | Submitted / queued | Monitor generated listing URL | External processing queue | `tmp/directory-submissions/secondary-directory-payloads.md` | API returned `valid: true`, `duplicate: false`, `status: queued`; verify listing before badge. |
| MCP Server Hub | https://mcpserverhub.com/submit | Submitted / pending review | Monitor listing publication | External review queue | `tmp/directory-submissions/secondary-directory-payloads.md` | Submitted through the Tally form; confirmation said `Form submitted` and `Thanks for your submission`. |
| MCP Market | https://mcpmarket.com/submit | Blocked / manual | Prepare copy only | Browser/login; possible anti-bot or paid acceleration | `tmp/directory-submissions/secondary-directory-payloads.md` | Try manually only if this directory is still valuable. |
| MCP Marketplace | https://mcp-marketplace.io/submit | Blocked / login | Prepare copy only | Browser/login | `tmp/directory-submissions/secondary-directory-payloads.md` | Submit after login if prioritized; no badge until listing exists. |

## Copy Blocks

Short description:

```text
Structured aquarium, marine, terrarium and paludarium data and public advisory functions for AI agents.
```

Long description:

```text
Atlarium MCP is a public read-only MCP server that gives AI agents structured access to data and advisory functions for aquariums, marine tanks, coldwater systems, terrariums, paludariums and vivariums. It includes animals, plants, products, guides, algae, diseases, plant problems, medicines, compatibility, fertilization, habitat planning and public aquarium calculators.
```

Connection block:

```text
Transport: Streamable HTTP
Endpoint: https://mcp.atlarium.bio/mcp
Auth: none
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Repository: https://github.com/techgardeners/atlarium-mcp
Official MCP Registry: bio.atlarium/habitat-database
```

Surface block:

```text
Surface: 39 public read-only tools for catalog data, diagnostics, products, fertilization, calculators, compatibility and habitat planning.
Prompts: 9 public guided prompts.
Widget: Apps-compatible Habitat Explorer resource at ui://widget/habitat-explorer.v3.html.
Safety: public read-only tools only; no user, workspace, admin, auth or write APIs.
```

## Before Any Badge

1. Verify the listing in a public browser or API response.
2. Confirm the listing names the correct endpoint `https://mcp.atlarium.bio/mcp`.
3. Confirm the listing does not imply unsupported write/auth/private workspace
   access.
4. Add README/docs badges only after visible acceptance.
5. Never claim ChatGPT approval until the OpenAI review portal shows acceptance
   or a public listing is available.

## Commands

Generate reusable payloads:

```bash
pnpm directories:submit -- --payload
```

Check public MCP and registry basics:

```bash
pnpm directories:submit -- --check
pnpm mcp:monitor:public
pnpm mcp:validate:public
```

Full public conformance:

```bash
pnpm mcp:conformance:public
```
