# Atlarium MCP Final Report

Report time: `2026-06-19T23:21:28Z`

Scope: public Atlarium MCP block only. This report does not cover general
Atlarium marketing, Product Hunt, aquarium communities, creator outreach, or
new ChatGPT App UI implementation.

## Live URLs

| Surface | URL | Status |
| --- | --- | --- |
| MCP endpoint | https://mcp.atlarium.bio/mcp | `GET` returns expected HTTP 405 JSON-RPC method-not-allowed; JSON-RPC session passes. |
| Healthcheck | https://mcp.atlarium.bio/health | HTTP 200, `status = ok`, version `1.0.0`. |
| Server card | https://mcp.atlarium.bio/.well-known/mcp/server-card.json | HTTP 200, 11 read-only tools and widget resource advertised. |
| Human docs | https://atlarium.bio/mcp | HTTP 200. |
| Client docs | `/mcp/openai-agents`, `/mcp/claude`, `/mcp/cursor`, `/mcp/windsurf`, `/mcp/vscode`, `/mcp/antigravity`, `/mcp/smithery`, `/mcp/chatgpt` | HTTP 200 for each checked page. |
| Sitemap | https://atlarium.bio/sitemap.xml | HTTP 200. |
| LLM map | https://atlarium.bio/llms.txt | HTTP 200 and includes MCP discovery section. |
| Glama claim | https://mcp.atlarium.bio/.well-known/glama.json | HTTP 200, returns the Glama connector claim JSON with maintainer email. |

## Directory Status

| Directory | Status | Evidence | Next action | Manual blocker |
| --- | --- | --- | --- | --- |
| Official MCP Registry | Published / active | API returned `metadata.count = 1`, `server.name = bio.atlarium/habitat-database`, official status `active`, `publishedAt = 2026-06-16T10:01:55.780369Z`. | Monitor and publish future versions from `server.json`. | None. |
| Smithery | Not listed; ready for maintainer submission | Smithery CLI search did not return Atlarium; `https://smithery.ai/new` redirects to hosted auth. | Submit payload from `docs/directory-submission-payloads.md`. | Atlarium/TechGardeners OAuth/login required. |
| Glama | Indexed as connector; claim file live | `https://glama.ai/mcp/connectors/bio.atlarium/habitat-database` returns HTTP 200 with Atlarium title, endpoint and registry name. `https://mcp.atlarium.bio/.well-known/glama.json` returns HTTP 200 with maintainer email. | Complete claim in Glama if the UI asks for confirmation. | Possible manual claim UI. |
| MCP.so | Submitted; listing not visible yet | GitHub issue comment `4722425013` exists and includes name, endpoint and registry. Candidate listing returned `Project not found`. | Monitor issue/listing; no badge until visible. | MCP.so maintainer publication. |
| PulseMCP | Manual check blocked; registry ingestion expected | Automated fetch of search/submit pages returned HTTP 403 Cloudflare block. | Recheck in browser or email payload after processing window if absent. | Browser/email required. |

## GitHub Actions

| Workflow | Latest checked run | Result |
| --- | --- | --- |
| `public-mcp-monitor.yml` | https://github.com/techgardeners/atlarium-mcp/actions/runs/27851702713 | `completed`, `success`, run created `2026-06-19T22:42:53Z`. |
| `mcp-directory-audit.yml` | https://github.com/techgardeners/atlarium-mcp/actions/runs/27851702726 | `completed`, `success`, run created `2026-06-19T22:42:53Z`. |

## Verification Run

Local repo checks:

```text
pnpm lint       PASS
pnpm typecheck  PASS
pnpm test       PASS, 8 files, 37 tests
pnpm build      PASS
```

Public MCP checks:

```text
pnpm mcp:monitor:public        PASS
pnpm directories:submit -- --check  PASS
pnpm mcp:validate:public       PASS, tools/list plus all 11 tool calls
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

## Changed Files

- `src/http.ts`: added public `/.well-known/glama.json` route.
- `src/metadata.ts`: added Glama claim metadata.
- `tests/http.test.ts`: added Glama claim route test.
- `README.md`: linked the new directory payload and launch-kit docs.
- `docs/publication-checklist.md`: updated directory tracker with URL, status, evidence, next action and blocker columns.
- `docs/directory-submission-payloads.md`: added final directory submission and claim payloads.
- `docs/mcp-technical-launch-kit.md`: added technical article, demo script and MCP-specific community posts.
- `docs/mcp-final-report.md`: this report.
- `examples/chatgpt-apps/README.md`: expanded ChatGPT submission metadata, safety notes, test prompts/responses and screenshot checklist.

## Residual Risks

- Glama ownership claim file is live; final acceptance may still require manual confirmation in Glama.
- Smithery requires maintainer OAuth/login.
- MCP.so submission is posted but publication is controlled by MCP.so maintainers.
- PulseMCP automated verification is blocked by Cloudflare from the audit environment.
- ChatGPT privacy-policy blocker is resolved: `https://atlarium.bio/privacy`
  and `https://atlarium.bio/en/privacy` return HTTP 200 and the page includes
  MCP / ChatGPT App data-access notes.
- ChatGPT App public approval must not be claimed until review is complete.

## Next Actions

1. Complete the Glama claim flow if the page still asks for manual confirmation.
2. Submit Smithery through an Atlarium/TechGardeners account.
3. Recheck MCP.so and PulseMCP listings before adding any badges.
4. Capture ChatGPT Developer Mode screenshots and refresh connector metadata
   before submission.
