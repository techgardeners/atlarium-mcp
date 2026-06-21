# Atlarium MCP Final Report

Report time: `2026-06-20`

Scope: public Atlarium MCP V2 block only. This report does not cover general
Atlarium marketing, Product Hunt, aquarium communities or creator outreach.

## Live URLs

| Surface | URL | Status |
| --- | --- | --- |
| MCP endpoint | https://mcp.atlarium.bio/mcp | `GET` returns expected HTTP 405 JSON-RPC method-not-allowed; JSON-RPC session passes. |
| Healthcheck | https://mcp.atlarium.bio/health | HTTP 200, `status = ok`, version `2.0.0`. |
| Server card | https://mcp.atlarium.bio/.well-known/mcp/server-card.json | Advertises 39 read-only tools, 9 prompts and widget resource. |
| Human docs | https://atlarium.bio/mcp | HTTP 200. |
| Client docs | `/mcp/openai-agents`, `/mcp/claude`, `/mcp/cursor`, `/mcp/windsurf`, `/mcp/vscode`, `/mcp/antigravity`, `/mcp/smithery`, `/mcp/chatgpt` | HTTP 200 for each checked page. |
| Sitemap | https://atlarium.bio/sitemap.xml | HTTP 200. |
| LLM map | https://atlarium.bio/llms.txt | HTTP 200 and includes MCP discovery section. |
| Glama claim | https://mcp.atlarium.bio/.well-known/glama.json | HTTP 200, returns the Glama connector claim JSON with maintainer email. |
| OpenAI Apps challenge | https://mcp.atlarium.bio/.well-known/openai-apps-challenge | HTTP 200; domain challenge token available for ChatGPT App verification. |

## Directory Status

| Directory | Status | Evidence | Next action | Manual blocker |
| --- | --- | --- | --- | --- |
| Official MCP Registry | Published / active | API returned `metadata.count = 1`, `server.name = bio.atlarium/habitat-database`, official status `active`, `publishedAt = 2026-06-16T10:01:55.780369Z`. | Monitor and publish future versions from `server.json`. | None. |
| Smithery | Published / visible; score `96/100` | `https://smithery.ai/servers/ilgrafico79/atlarium-habitat-database` has a successful release that discovered `Atlarium Habitat Database MCP`, version `2.0.0`, 39 tools, 9 prompts and 3 resources. After the parameter-description deploy and custom icon upload, Smithery shows `Parameter descriptions 39/39` and quality score `96/100`. The Smithery TXT value is live on `atlarium.bio`, and Smithery now marks the release, quality, homepage, TXT and backlink checks as passing. | Decide whether a paid Smithery developer plan is worth it; do not add a Smithery verified badge unless that paid-plan requirement is actually satisfied. Avoid breaking public tool names only to satisfy the remaining naming heuristic. | Paid developer plan is the only visible verification blocker. |
| Glama | Ownership verified / listing healthy | `https://glama.ai/mcp/connectors/bio.atlarium/habitat-database` shows healthy status, 39 tools, Admin/Analytics access and canonical V2 description. `https://mcp.atlarium.bio/.well-known/glama.json` returns HTTP 200 with maintainer email. | Monitor listing health and tool quality score; add badge/link only after badge policy approval. | None for ownership. |
| MCP.so | Listed / visible; dashboard ownership mismatch | `https://mcp.so/server/atlarium-habitat-database-mcp` returns HTTP 200 with title `Atlarium Habitat Database MCP MCP Server`, canonical public read-only description and the GitHub repository link. GitHub issue comment `4722425013` remains historical submission evidence. Old candidate slug `https://mcp.so/server/atlarium-habitat-database` still returns `Project not found`. The signed-in `https://mcp.so/my-servers` dashboard for Roberto ilGrafico / `ilgrafico79@gmail.com` currently shows `No servers`, so public visibility and edit ownership are separate states. | Monitor listing metadata; ask MCP.so maintainers to attach the listing to the account only if dashboard edits are needed; add badge/link only after badge policy approval. | None for visibility; account linkage needed only for future dashboard edits. |
| PulseMCP | Listed / visible | `https://www.pulsemcp.com/servers/techgardeners-atlarium-habitat-database` shows Atlarium Habitat Database, provider Tech Gardeners, `server.json file available`, `bio.atlarium/habitat-database`, auth Open, Streamable HTTP and Free cost. | Monitor the listing and keep registry/server.json metadata current before adding badges elsewhere. | None for visibility; automated curl can still hit Cloudflare 403. |
| MCP Scoreboard | Listed / unscored | Public listing exists and points to Atlarium GitHub and endpoint links. | Owner verification/scoring only if useful; no score badge while unscored. | GitHub owner verification may be required. |
| mcpservers.org | Listed / visible | `https://mcpservers.org/servers/techgardeners/atlarium-mcp` returns HTTP 200 and includes `Atlarium Habitat Database MCP`, the canonical endpoint, repository, docs, server card and 39-tool read-only surface. | Monitor listing metadata after server-card or README changes; add badge/link only after badge policy approval. | None for visibility. |
| MCPRepository | Submitted / queued | API response accepted `https://github.com/techgardeners/atlarium-mcp` with `status: queued`, `valid: true`, `duplicate: false`, and expected URL `https://mcprepository.com/techgardeners/atlarium-mcp`. | Monitor generated listing URL; no badge until visible. | External processing queue. |
| MCP Server Hub | Submitted / pending review | Tally form confirmed `Form submitted` and `Thanks for your submission! We'll review and display your MCP Server later.` | Monitor public listing; no badge until visible. | External review queue. |
| MCP Market / Marketplace | Blocked / manual | Submission flows can require login or hit anti-bot checkpoints. | Try from a logged-in browser only if still worth prioritizing. | Browser/login/checkpoint. |

## ChatGPT App Status

| Surface | Status | Evidence | Next action | Manual blocker |
| --- | --- | --- | --- | --- |
| ChatGPT App review | Submitted / in review | Submission package includes endpoint, privacy URL, `chatgpt-app-submission.json`, app icon, screenshots, demo video, read-only safety notes and the live OpenAI Apps challenge endpoint. | Monitor OpenAI review. If requested, patch repo/server/docs, redeploy, rescan metadata and reply in the portal. | OpenAI account access for portal state, review replies and final acceptance. |

## GitHub Actions

| Workflow | Latest checked run | Result |
| --- | --- | --- |
| `public-mcp-monitor.yml` | https://github.com/techgardeners/atlarium-mcp/actions/runs/27858424823 | `completed`, `success`, run created `2026-06-20T03:10:53Z`. |
| `mcp-directory-audit.yml` | https://github.com/techgardeners/atlarium-mcp/actions/runs/27852860976 | `completed`, `success`, run created `2026-06-19T23:23:15Z`. |

## Verification Run

Local repo checks:

```text
pnpm lint       PASS
pnpm typecheck  PASS
pnpm test       PASS, 8 files, 44 tests
pnpm build      PASS
PUSH_IMAGE=true pnpm pipeline:local  PASS, image pushed to GHCR
pnpm deploy:spartaco                 PASS, rollout successful on namespace atlarium-mcp
```

Public MCP checks:

```text
pnpm mcp:monitor:public             PASS, 39 read-only tools, 9 prompts, widget resource, OpenAI Apps challenge
pnpm directories:submit -- --check  PASS, docs/health/server-card/MCP 405/registry found
pnpm mcp:validate:public            PASS, tools/list, prompts/list and representative tool calls by family
pnpm mcp:conformance:public         PASS, initialize, logging, ping, tools-list, simple tool call and tool error scenarios
```

Web/docs checks:

```text
https://atlarium.bio/mcp HTTP 200
https://atlarium.bio/mcp/openai-agents HTTP 200
https://atlarium.bio/mcp/claude HTTP 200
https://atlarium.bio/mcp/cursor HTTP 200
https://atlarium.bio/mcp/windsurf HTTP 200
https://atlarium.bio/mcp/vscode HTTP 200
https://atlarium.bio/mcp/antigravity HTTP 200
https://atlarium.bio/mcp/smithery HTTP 200
https://atlarium.bio/mcp/chatgpt HTTP 200
https://atlarium.bio/sitemap.xml HTTP 200
https://atlarium.bio/llms.txt HTTP 200
```

Targeted Glama endpoint note:

```text
https://mcp.atlarium.bio/.well-known/glama.json HTTP 200
```

The response body contains the Glama connector schema and maintainer email
`info@techgardeners.com`.

## Production Surface Summary

- V2 public tool surface is live with 39 read-only tools and 9 prompts.
- ChatGPT App widget resource is `ui://widget/habitat-explorer.v3.html`; v2/v1
  aliases remain served for cached metadata.
- OpenAI Apps challenge and Glama claim endpoints are live.
- No workspace, auth, admin, private-data or write tools are exposed.

## Current Documentation Update

- `README.md`: updated ChatGPT review state, screenshot/demo asset references
  and publication tracking links.
- `docs/publication-checklist.md`: updated ChatGPT submitted/in-review state,
  latest verification timestamp and external review backlog.
- `docs/directory-submission-payloads.md`: added MCP Scoreboard,
  mcpservers.org, MCPRepository, MCP Server Hub and MCP Market/Marketplace
  payloads.
- `docs/mcp-submission-cockpit.md`: added operational cockpit for manual
  directory, claim and ChatGPT review follow-up flows.
- `docs/mcp-technical-launch-kit.md`: added ChatGPT review status post and
  submission asset list.
- `docs/github-showcase.md`, `docs/mcp.md`, `docs/mcp/public-page.md` and
  `examples/chatgpt-apps/README.md`: aligned status copy and asset references.
- `scripts/submit-directories.mjs`: refreshed V2 payload generation and added
  secondary directory payload artifacts.
- `src/schemas.ts` and `tests/tools.test.ts`: added published JSON Schema
  descriptions for every MCP input parameter and a regression test enforcing
  parameter-description coverage.

## Residual Risks

- Glama ownership is verified and owner controls are available.
- Smithery is published and visible; all visible technical verification checks
  pass, and the remaining Smithery score gap is a naming heuristic, not
  endpoint, icon or tool metadata. Full Smithery verification remains gated by
  the paid developer plan requirement.
- MCP.so is now publicly visible at
  `https://mcp.so/server/atlarium-habitat-database-mcp`; use that slug because
  the shorter `atlarium-habitat-database` slug still returns `Project not found`.
- PulseMCP listing is visible; automated verification can still be blocked by Cloudflare from some audit environments.
- ChatGPT privacy-policy blocker is resolved: `https://atlarium.bio/privacy`
  and `https://atlarium.bio/en/privacy` return HTTP 200 and the page includes
  MCP / ChatGPT App data-access notes.
- ChatGPT App public approval must not be claimed until review is complete.
- ChatGPT App is submitted / in review; OpenAI can request changes before
  acceptance.

## Next Actions

1. Decide whether to upgrade Smithery for verified status; otherwise keep it
   published/unverified with no badge.
2. Monitor Glama listing health and TDQS after the canonical description update.
3. Use the accepted mcpservers.org listing as follow-up evidence for
   MCPRepository and MCP Server Hub until their public listing URLs are visible.
4. Monitor MCP.so, PulseMCP and Glama metadata after future server-card changes;
   add badges only when the badge policy is intentionally approved.
5. Monitor ChatGPT App review; if OpenAI asks for changes, patch, redeploy,
   rescan metadata and respond in the portal.
