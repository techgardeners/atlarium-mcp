# Atlarium MCP 2.0.3 Final Report

Report time: `2026-08-18T17:39:42Z`

Scope: Atlarium Habitat Database MCP, Habitat Explorer v4, production
reliability, Official MCP Registry and MCP/agent distribution. General Atlarium
marketing and unrelated website work are outside this report.

## Release Outcome

- Production health reports `2.0.3` and `status = ok`.
- The public Streamable HTTP endpoint is
  `https://mcp.atlarium.bio/mcp` with no authentication and read-only behavior.
- The public surface remains exactly 39 tools, 9 prompts and 4 widget resources.
- Habitat Explorer v4 is served at
  `ui://widget/habitat-explorer.v4.html`; v3, v2 and v1 remain compatible aliases.
- The Official MCP Registry exposes `bio.atlarium/habitat-database` version
  `2.0.3` as `active` and `isLatest`; `publishedAt` is
  `2026-08-17T00:10:15.358882Z`.
- The public server card, health route, MCP session, representative tool calls,
  ChatGPT submission validator and public conformance suite pass.

## Habitat Explorer v4

The v4 widget is a React 19/Vite application bundled as one self-contained HTML
resource. It replaces the legacy monolithic dashboard skin with tool-specific
ChatGPT views for search, profiles, compatibility, suggestions, habitat plans,
diagnostics, fertilization and calculators.

Acceptance points verified by deterministic fixtures and screenshots:

- responsive inline and fullscreen layouts;
- light and dark ChatGPT themes;
- English, Italian and Spanish UI, loading, error and advisory copy;
- host globals for theme, display mode, height, safe area, locale and widget
  state;
- capability-detected fullscreen and persisted carousel selection;
- mascots only in loading, empty and error states without duplicated app
  branding;
- no hardcoded species fallback or demo content in live tool results;
- maximum two inline actions, keyboard focus and reduced-motion support;
- bundle budget below 500 KB compressed.

Real ChatGPT web and responsive 390x844 publishing screenshots are recorded.
Three compliant 706px ChatGPT-hosted crops for search, profile and Italian
compatibility are uploaded and saved in the signed-in OpenAI `2.0.3` draft.
The release notes were corrected to `2.0.3` and the App dashboard submission
was completed on 2026-08-18. OpenAI Platform shows status `Review`; the linked
demo is responsive-web evidence, so native iOS/Android evidence may still be
requested. Public ChatGPT approval is not claimed.

## Production Reliability

Production inspection found no 5xx responses, timeouts, crashes, restarts or
rollout instability. The dominant historical failures were invalid or missing
slugs. The release therefore keeps exact-slug semantics and updates every
`get_*` description to require the slug returned by its related `search_*`
tool; it does not introduce fuzzy lookup or hidden fallbacks.

Operational corrections:

- request outcomes use `not_found`, `invalid_slug`, `validation_error` and
  `internal_error`;
- logs retain only RPC method, public tool name, duration, outcome and error
  code;
- malformed JSON, arguments, prompts, IP addresses and complete user agents are
  excluded;
- `x-atlarium-probe` separates synthetic monitoring from external traffic;
- `pnpm mcp:report:usage -- --production --since=720h --strict` enforces the
  privacy boundary and rejects forbidden fields or unknown error codes;
- the public monitor runs every 30 minutes and the registry/directory audit runs
  daily;
- the default production SSH alias is `spartaco`.

The initial production report confirms zero forbidden client fields and correct
synthetic/external separation. The 14-day baseline remains a time-dependent
follow-up rather than a release blocker.

The final `2.0.3` rollout runs two replicas on immutable image digest
`sha256:1f1e4f1eaeac01f745c84476d4e65aa64e965a0b9eabafb82e746e5210862fa9`,
both ready with zero restarts. The release source is commit `b0c06ad`, tagged
`v2.0.3`. The earlier `2.0.2` rollout exercised automatic rollback when a
legacy pod-label selector failed the new identity gate; the selector and its
regression contract were corrected before the successful release sequence.

The strict post-release snapshot captured at `2026-08-16T23:15:02.760Z`
contains 53 requests and 10 tool calls, all successful, with zero unclassified
events, forbidden fields or invalid error codes. Synthetic probes remain
separated from external traffic.

Initial production snapshot captured at `2026-08-16T22:02:46.618Z` with
`--since=720h --strict`:

- 192 MCP requests: 134 external and 58 synthetic;
- 22 tool calls: 7 external and 15 synthetic;
- zero request or tool-call errors;
- zero unclassified events;
- zero forbidden client fields and zero invalid error codes;
- probes: 36 public monitor, 24 public validator and 13 ChatGPT submission
  validator events.

This is the pre-localization release-day baseline. The required 14-day
comparison for the final `2.0.3` release must run on or after `2026-08-31` with
the same strict command and remain separate from synthetic probe traffic.

## Accepted Public Distribution

Only currently visible or accepted surfaces appear here. No static third-party
score or paid badge is claimed.

| Surface | State | Public evidence |
| --- | --- | --- |
| Official MCP Registry | Published / active / latest `2.0.3` | https://registry.modelcontextprotocol.io/v0.1/servers?search=bio.atlarium%2Fhabitat-database |
| GitHub | Published | https://github.com/techgardeners/atlarium-mcp |
| Smithery | Published; ownership/refresh requested | https://smithery.ai/servers/ilgrafico79/atlarium-habitat-database |
| Glama | Ownership verified | https://glama.ai/mcp/connectors/bio.atlarium/habitat-database |
| MCP.so | Listed; ownership verified; `2.0.3` persistence fix requested | https://mcp.so/servers/atlarium-mcp |
| PulseMCP | Listed | https://www.pulsemcp.com/servers/techgardeners-atlarium-habitat-database |
| MCP Scoreboard | Listed / unscored | https://www.mcpscoreboard.com/server/8fb9547d-bdb4-4fab-8218-ef13c1be32fc/ |
| mcpservers.org | Listed | https://mcpservers.org/servers/techgardeners/atlarium-mcp |
| MCPRepository | Published | https://mcprepository.com/techgardeners/atlarium-mcp |
| MCP Queen | Verified | https://mcpqueen.com/s/bio.atlarium%2Fhabitat-database |
| MCP Market | Listed | https://mcpmarket.com/server/atlarium-habitat-database |

## New Submissions And Reviews

| Surface | State | Evidence / next checkpoint |
| --- | --- | --- |
| MCP.Directory | Submitted | Confirmation received; D7/D14/D30 follow-up recorded. |
| MCP Catalog | Submitted | Editorial review normally takes a few days. |
| MCP Find | Submitted | https://github.com/MCPFind/mcp-find/pull/143 |
| awesome-mcp.tools | Submitted | https://github.com/adw0rd/awesome-mcp-servers/issues/45 |
| Cursor Marketplace | Submitted | Signed-in publisher application received. |
| cursor.directory | In review | https://cursor.directory/plugins/atlarium-habitat-database |
| MCP Server Hub | Resubmitted | Version `2.0.1` form confirmation received. |
| MCP Marketplace | Published / verified | Canonical `2.0.1` listing reports 39 tools, no auth, 10/10 low-risk security and successful public health probes. |
| MCP.so ownership | Verified | The authenticated dashboard lists one Published Atlarium record and exposes editing. |
| Cline Marketplace | Submitted | https://github.com/cline/mcp-marketplace/issues/2253 |
| ChatGPT App | In review | Version `2.0.3` was submitted on 2026-08-18 with corrected release notes, 39-tool rescan, three compliant screenshots and the portrait responsive-web demo; OpenAI Platform shows `Review`. |

MCP Trove and Lulu remain blocked because no legitimate current submission
surface could be verified. GitHub MCP Registry search has no Atlarium result;
GitHub still describes the catalog as curated and exposes no public
self-submission path, so it remains blocked without duplicating the already
published Official Registry entry. No premium listing, paid badge or expedited
review was purchased.

The canonical record is `config/distribution-registry.json`. Pending entries
contain the submitted payload, evidence, attempt number and D7/D14/D30 follow-up
dates without storing submitter contact data.

## Verification

Release gates:

```text
pnpm lint                              PASS
pnpm typecheck                         PASS
pnpm test                              PASS
pnpm build                             PASS
pnpm widget:validate                   PASS
pnpm version:check                     PASS
pnpm registry:verify                   PASS, 2.0.3 active/latest
pnpm directories:submit -- --check     PASS
pnpm mcp:monitor:public                PASS, 39 tools / 9 prompts / v4
pnpm mcp:validate:public               PASS
pnpm mcp:conformance:public            PASS, 6 scenarios
pnpm chatgpt:validate-submission        PASS
```

Latest recorded automation evidence:

- public monitor:
  https://github.com/techgardeners/atlarium-mcp/actions/runs/32163942229
- daily directory audit:
  https://github.com/techgardeners/atlarium-mcp/actions/runs/32111628484

## Remaining External Checkpoints

- monitor the Smithery ownership/refresh request sent to `contact@smithery.ai`;
- monitor the MCP.so metadata persistence request sent to `support@mcp.so`;
- monitor the OpenAI `2.0.3` review and provide native iOS/Android evidence if
  requested;
- follow every non-terminal directory at days 7, 14 and 30;
- collect and append the 14-day production usage/error baseline.

These are external review or elapsed-time states. They do not change the fact
that MCP `2.0.3`, Habitat Explorer v4 and the Official Registry version are live.
