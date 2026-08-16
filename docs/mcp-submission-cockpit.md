# Atlarium MCP Submission Cockpit

Last updated: `2026-08-16T23:12:51Z`

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
| Candidate version | none — source, production and Registry are aligned |
| Current production / Registry | `2.0.2` |
| Tool surface | 39 public read-only tools |
| Prompts | 9 public guided prompts |
| Widget | `ui://widget/habitat-explorer.v4.html` |
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
| Official MCP Registry | https://registry.modelcontextprotocol.io/v0.1/servers?search=bio.atlarium%2Fhabitat-database | Published / active / latest at `2.0.2` | Verify public endpoint and exact Registry version | Atlarium DNS key is required for future domain-namespace releases | `server.json`, `scripts/publish-official-registry.sh` | Use `pnpm registry:publish`; the workflow verifies the live DNS proof and public result. |
| ChatGPT App | OpenAI Platform Apps review portal | Existing app `1.0.0` approved; Habitat Explorer v4 / MCP `2.0.2` visually approved on 2026-08-16 and not yet resubmitted | Keep production endpoint green, keep deterministic submission validation passing and prepare real ChatGPT screenshots | OpenAI account for endpoint rescan, screenshot upload, review replies and final submit | `chatgpt-app-submission.json`, `examples/chatgpt-apps/README.md`, `docs/chatgpt-review-remediation.md` | After production deploy, replace widget-only screenshots with ChatGPT web/mobile captures, rescan endpoint and submit the new candidate. |
| Glama | https://glama.ai/mcp/connectors/bio.atlarium/habitat-database | Ownership verified / listing healthy | Monitor listing health, analytics and tool quality score | None for ownership; account needed only for future edits | `https://mcp.atlarium.bio/.well-known/glama.json` | Keep accepted; add badge/link only if badge policy is approved. |
| Smithery | https://smithery.ai/servers/ilgrafico79/atlarium-habitat-database | Published / visible | Keep release metadata healthy and request a metadata refresh after runtime changes | Signed-in maintainer access is required for release controls; no paid verification will be purchased | `tmp/directory-submissions/secondary-directory-payloads.md` after `pnpm directories:submit -- --payload` | Production exposes `2.0.2`, 39 tools, 9 prompts and 4 widget resources; directory metadata refresh remains pending and no static score is published. |
| MCP.so | https://chat.mcp.so/server/atlarium-habitat-database-mcp/techgardeners | Listed / visible; `2.0.2` refresh submitted | Monitor listing metadata and slug; request account linkage only if edits are needed | None for visibility; ownership linkage remains under review | `tmp/directory-submissions/mcp-so-comment.md` | Release update evidence: https://github.com/chatmcp/mcpso/issues/1#issuecomment-5310166395. |
| PulseMCP | https://www.pulsemcp.com/servers/techgardeners-atlarium-habitat-database | Listed / visible | Monitor listing and registry sync | None unless correction request is needed | `tmp/directory-submissions/pulsemcp-email.md` | Keep visible as accepted; add badges only after deciding badge policy. |
| MCP Scoreboard | https://www.mcpscoreboard.com/server/8fb9547d-bdb4-4fab-8218-ef13c1be32fc/ | Listed / unscored | Verify listing and draft scoring request | GitHub owner verification for scoring | `docs/directory-submission-payloads.md` | Request scoring only if owner verification is worth the time; no score badge while unscored. |
| mcpservers.org | https://mcpservers.org/servers/techgardeners/atlarium-mcp | Listed / visible | Monitor listing metadata after server-card or README changes | None for visibility | `tmp/directory-submissions/secondary-directory-payloads.md` | Public page returns HTTP 200 with Atlarium title, canonical endpoint, repository, docs, server card and 39-tool read-only surface. Add badges only after badge policy approval. |
| MCPRepository | https://mcprepository.com/techgardeners/atlarium-mcp | Published / visible | Monitor repository metadata refreshes | None for visibility | `config/distribution-registry.json` | Public listing returns HTTP 200 with the Atlarium title. |
| MCP Server Hub | https://mcpserverhub.com/submit | Submitted / pending review | Monitor listing publication | External review queue | `tmp/directory-submissions/secondary-directory-payloads.md` | Submitted through the Tally form; confirmation said `Form submitted` and `Thanks for your submission`. |
| MCP Market | https://mcpmarket.com/server/atlarium-habitat-database | Listed / visible | Monitor listing metadata and automated availability | None for the existing public listing | `config/distribution-registry.json` | Keep the free listing; automated audits may receive provider `403/429` responses. |
| MCP Marketplace | https://mcp-marketplace.io/server/bio-atlarium-habitat-database | Published / verified at `2.0.1` | Monitor the canonical listing and automated health checks | None for the canonical public listing; a duplicate manual submission is superseded | `config/distribution-registry.json` | Public listing reports 39 tools, no auth, 10/10 low-risk security, a successful probe and 100% 24-hour / 7-day uptime at the last verification. |

## Copy Blocks

Short description:

```text
Structured habitat data and advisory tools for aquariums, marine tanks, terrariums and paludariums.
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
Widget: Apps-compatible Habitat Explorer resource at ui://widget/habitat-explorer.v4.html.
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
pnpm chatgpt:validate-submission
```

Full public conformance:

```bash
pnpm mcp:conformance:public
```
