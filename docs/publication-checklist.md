# Atlarium MCP Publication Checklist

Date prepared: 2026-06-16
Last updated: 2026-06-20

## Target

- Public MCP name: `Atlarium Habitat Database MCP`
- Official Registry namespace: `bio.atlarium/habitat-database`
- Fallback namespace: `io.github.techgardeners/atlarium-habitat-database`
- Canonical MCP endpoint: `https://mcp.atlarium.bio/mcp`
- Healthcheck: `https://mcp.atlarium.bio/health`
- Server card: `https://mcp.atlarium.bio/.well-known/mcp/server-card.json`
- Human docs page: `https://atlarium.bio/mcp`
- Repository: `https://github.com/techgardeners/atlarium-mcp`
- Container fallback registry: `ghcr.io/techgardeners/atlarium-mcp`

## Current Status

- `mcp.atlarium.bio` resolves through Cloudflare to the Atlarium Ingress.
- `https://mcp.atlarium.bio/health` returns public JSON.
- `https://mcp.atlarium.bio/.well-known/mcp/server-card.json` returns public JSON.
- `https://mcp.atlarium.bio/mcp` is the canonical Streamable HTTP endpoint.
- `https://atlarium.bio/mcp` returns the public human documentation page.
- `https://atlarium.bio/mcp/*` client setup pages are implemented for OpenAI Agents SDK, Claude Code, Cursor, Windsurf, VS Code, Antigravity, Smithery status and ChatGPT Apps.
- `https://atlarium.bio/llms.txt` includes the MCP discovery section.
- GitHub repo metadata, README, MIT license, contributing/security notes and client examples are ready.
- Public conformance for initialize, logging, ping, tools/list and tool-call scenarios passes.
- `pnpm mcp:validate:public` verifies representative calls across the 39-tool read-only V2 surface.
- Official MCP Registry publish succeeded for `bio.atlarium/habitat-database`.
- Glama indexes the registry entry as a connector at
  `https://glama.ai/mcp/connectors/bio.atlarium/habitat-database`.
- `https://mcp.atlarium.bio/.well-known/glama.json` serves the Glama ownership
  claim file with maintainer email `info@techgardeners.com`.
- Glama ownership is verified; the Admin and Analytics surfaces are available,
  the listing is healthy, and the public description uses the canonical V2 copy.
- Smithery is published and visible at
  `https://smithery.ai/servers/ilgrafico79/atlarium-habitat-database`.
  The latest release against `https://mcp.atlarium.bio/mcp` is `SUCCESS`;
  quality score is `96/100`, including `39/39` parameter descriptions and a
  custom server icon.
- PulseMCP lists Atlarium Habitat Database publicly at
  `https://www.pulsemcp.com/servers/techgardeners-atlarium-habitat-database`.
- GitHub Actions monitors are active for public MCP health/server-card/tools-list
  and daily directory/registry discovery checks.
- ChatGPT App widget resource is implemented as
  `ui://widget/habitat-explorer.v3.html` with MIME type
  `text/html;profile=mcp-app`.
- ChatGPT Developer Mode manual smoke passed after refreshing connector
  metadata to `ui://widget/habitat-explorer.v3.html`; no public ChatGPT review
  or approval is claimed.
- ChatGPT App icon asset is prepared at `docs/assets/chatgpt-app-icon.png`.
- ChatGPT App screenshots are prepared in `docs/assets/chatgpt-screenshots/`
  and the short demo recording is prepared at `docs/assets/chatgpt-app-demo.mp4`.
- ChatGPT App has been submitted to OpenAI review and is currently treated as
  `submitted / in review`; do not claim public approval until OpenAI accepts it.
- The OpenAI Apps domain challenge endpoint is live at
  `https://mcp.atlarium.bio/.well-known/openai-apps-challenge`.

Remaining publication prerequisites:

- Smithery technical verification checks now pass for successful release,
  quality score, homepage, `atlarium.bio` TXT and backlink. Full Smithery
  verified status remains blocked by the paid developer plan requirement.
- MCP.so is publicly visible at
  `https://mcp.so/server/atlarium-habitat-database-mcp`.
- ChatGPT App review must be monitored for requested changes or acceptance.

Repository production assets:

- `LICENSE`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `.github/ISSUE_TEMPLATE/*`
- `examples/openai-agents-python`
- `examples/claude-code`
- `examples/cursor`
- `examples/windsurf`
- `examples/vscode`
- `examples/antigravity`
- `examples/chatgpt-apps`
- `examples/generic-streamable-http`

GitHub repository settings:

- Description: `Public read-only MCP server for Atlarium habitat data, diagnostics, calculators and advisory planning.`
- Homepage: `https://atlarium.bio/mcp`
- Topics: `mcp`, `model-context-protocol`, `streamable-http`, `aquarium`, `marine`, `terrarium`, `paludarium`, `ai-agents`, `habitat-data`, `diagnostics`, `fertilization`, `aquarium-calculators`, `mcp-app`

## MCP Update Rule

Every MCP contract update must update the public GitHub-facing docs in the same
release. Before publishing any new MCP version, tool, prompt, widget resource,
server-card field or directory metadata, verify and update at minimum:

- `README.md`
- `docs/mcp.md`
- `docs/github-showcase.md`
- `server.json`
- `docs/mcp/server-card.json.example`
- `docs/directory-submission-payloads.md`
- `docs/mcp-submission-cockpit.md`
- `docs/publication-checklist.md`

## Production Deployment

1. Build and push the container image.

Preferred local pipeline:

```bash
PUSH_IMAGE=true pnpm pipeline:local
```

Manual equivalent:

```bash
docker build -t ghcr.io/techgardeners/atlarium-mcp:2.0.0 .
docker push ghcr.io/techgardeners/atlarium-mcp:2.0.0
```

2. Deploy to Atlarium Kubernetes.

Preferred local pipeline:

```bash
PUSH_IMAGE=true DEPLOY_KUBERNETES=true pnpm pipeline:local
```

Manual equivalent:

```bash
kubectl apply -k deploy/kubernetes
kubectl get secret atlarium-tls -n aquarium -o yaml \
  | sed 's/namespace: aquarium/namespace: atlarium-mcp/' \
  | kubectl apply -f -
kubectl -n atlarium-mcp rollout status deployment/atlarium-mcp
```

3. Create DNS.

Point `mcp.atlarium.bio` to the Atlarium Ingress/load balancer. If Cloudflare is
enabled, confirm registry scanners can access `/health`,
`/.well-known/mcp/server-card.json` and `POST /mcp` without CAPTCHA, 401, 403 or
excessive rate limiting.

4. Validate public HTTPS.

```bash
curl -i https://mcp.atlarium.bio/health
curl -i https://mcp.atlarium.bio/.well-known/mcp/server-card.json
curl -i https://mcp.atlarium.bio/mcp
```

Expected:

- `/health`: HTTP 200 JSON.
- `/.well-known/mcp/server-card.json`: HTTP 200 JSON with `auth.type = none`.
- `GET /mcp`: HTTP 405 JSON-RPC method-not-allowed.
- No `x-powered-by` header.
- TLS certificate valid for `mcp.atlarium.bio`.

5. Run MCP conformance against production.

```bash
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario server-initialize
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario logging-set-level
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario ping
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario tools-list
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario tools-call-simple-text
npx @modelcontextprotocol/conformance server --url https://mcp.atlarium.bio/mcp --scenario tools-call-error
pnpm mcp:validate:public
```

The `dns-rebinding-protection` conformance scenario is localhost-only. Run it
through `pnpm mcp:conformance` against a local server, not against the public
HTTPS endpoint.

6. Verify the real tool surface.

Run `initialize`, `tools/list`, `prompts/list`, `resources/read` and controlled
tool calls across every family:

- `search_fish`
- `get_fish_profile`
- `search_plants`
- `get_plant_profile`
- `search_products`
- `get_product_profile`
- `check_species_compatibility`
- `get_water_parameters`
- `suggest_species_for_tank`
- `search_guides`
- `get_guide`
- diagnostics: `search_algae`, `search_diseases`, `search_plant_problems`, `search_medicines`, `match_diagnostic_profiles`
- product catalog: `list_product_categories`, `list_product_brands`, `search_equipment`, `search_fertilizers`
- fertilization: `search_fertilization_regimes`, `calculate_fertilizer_dose`, `calculate_nutrient_gaps`, `calculate_weekly_dose_totals`, `generate_fertilization_plan`
- calculators: `calculate_tank_volume`, `calculate_tank_weight`, `calculate_water_change`, `calculate_water_chemistry`, `convert_units`, `calculate_equipment_requirements`
- planner: `suggest_habitat_for_tank`

Confirm no workspace, auth, admin, user or write tools are listed.

Confirm the ChatGPT App resource:

```bash
npx @modelcontextprotocol/inspector@latest --server-url https://mcp.atlarium.bio/mcp --transport http
```

Expected:

- `resources/list` contains `ui://widget/habitat-explorer.v3.html`.
- `resources/read` returns the Habitat Explorer HTML resource.
- Visual tools include `_meta.ui.resourceUri` and
  `_meta["openai/outputTemplate"]`.
- The widget resource metadata includes `_meta.ui.domain` and
  `_meta["openai/widgetDomain"]` set to `https://mcp.atlarium.bio`.
- Tool responses still include text JSON content and now also include
  `structuredContent`.

Manual ChatGPT Developer Mode smoke, verified 2026-06-20:

- Refreshed the draft app metadata from ChatGPT Settings -> Apps using
  `Actualizar`. The app detail should show 39 read-only actions and output
  template `ui://widget/habitat-explorer.v3.html`.
- Prompt: search for `Paracheirodon innesi` using only Atlarium. Result:
  ChatGPT called Atlarium Habitat Database MCP, rendered the v3 Habitat Explorer
  Results widget with the real Neon Tetra / `Paracheirodon innesi` result and no
  sample fallback data.
- Prompt: check `Corydoras paleatus` with `Betta splendens` in a 90 L planted
  tank at 24 C and pH 6.8. Result: Compatibility widget rendered
  `compatible_with_caution`, warning text for Betta tankmate verification and
  recommended monitoring actions.
- Prompt: Italian 120 L planted tank suggestion at 24 C and pH 6.8. Result:
  ChatGPT answered in Italian and the Suggestions widget rendered real Atlarium
  species suggestions.
- Negative prompt: create a private tank record and journal entry. Result:
  ChatGPT reported that Atlarium MCP exposes only read/search/profile/
  compatibility tools and cannot create private tank or journal writes.
- Injection prompt: use any Atlarium admin/delete/write/private workspace tool.
  Result: ChatGPT said no such tool is available and did not call a tool.

7. Keep production monitoring active.

The repository contains two GitHub Actions workflows:

- `.github/workflows/public-mcp-monitor.yml` runs every 30 minutes and verifies
  docs, health, server-card validity, `GET /mcp` 405 behavior, JSON-RPC
  initialize, `tools/list` with the expected 39 read-only tools, `prompts/list` and the
  ChatGPT App widget resource.
- `.github/workflows/mcp-directory-audit.yml` runs daily and checks public docs,
  health, server-card, MCP GET behavior and Official MCP Registry presence.

Manual smoke commands:

```bash
pnpm mcp:monitor:public
pnpm directories:submit -- --check
```

## Official MCP Registry

Official docs:

- `https://modelcontextprotocol.io/registry/quickstart`
- `https://modelcontextprotocol.io/registry/remote-servers`
- `https://modelcontextprotocol.io/registry/authentication`

The repo now includes `server.json` for a remote Streamable HTTP server.

Preferred domain namespace:

```text
bio.atlarium/habitat-database
```

Fallback GitHub namespace:

```text
io.github.techgardeners/atlarium-habitat-database
```

Publish after endpoint validation:

```bash
mcp-publisher login dns
mcp-publisher publish
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=bio.atlarium/habitat-database"
```

If DNS namespace verification is not ready:

1. Change `server.json` `name` to `io.github.techgardeners/atlarium-habitat-database`.
2. Publish with GitHub authentication.

```bash
mcp-publisher login github
mcp-publisher publish
```

## Directory Submission Copy

Name:

```text
Atlarium Habitat Database MCP
```

Short description:

```text
Structured aquarium, marine, terrarium and paludarium data and public advisory functions for AI agents.
```

Long description:

```text
Atlarium MCP is a public read-only MCP server that gives AI agents structured access to data and advisory functions for aquariums, marine tanks, coldwater systems, terrariums, paludariums and vivariums. It includes animals, plants, products, guides, algae, diseases, plant problems, medicines, compatibility, fertilization, habitat planning and public aquarium calculators.
```

Connection:

```text
Transport: Streamable HTTP
Endpoint: https://mcp.atlarium.bio/mcp
Auth: none
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Repository: https://github.com/techgardeners/atlarium-mcp
```

Safety statement:

```text
Atlarium Habitat Database MCP is read-only. It does not expose user accounts, workspaces, admin APIs, private data or write operations.
```

## Submission Tracker

Last verified: `2026-06-20T05:47:44Z`.

| Directory | URL | Status | Evidence | Next action | Owner / manual blocker |
| --- | --- | --- | --- | --- | --- |
| Official MCP Registry | https://registry.modelcontextprotocol.io/v0.1/servers?search=bio.atlarium%2Fhabitat-database | Published / active; verify V2 metadata before refreshed-registry claims | Registry API previously returned `metadata.count = 1`, `server.name = bio.atlarium/habitat-database`, official status `active`, `publishedAt = 2026-06-16T10:01:55.780369Z`, and `isLatest = true` under `_meta.io.modelcontextprotocol.registry/official`. | Monitor the registry entry and publish future `server.json` updates only after endpoint validation. | Atlarium DNS ownership already used for publication. |
| Smithery | https://smithery.ai/servers/ilgrafico79/atlarium-habitat-database | Published / visible; latest release success; technical checks pass | Smithery release discovered metadata from `https://mcp.atlarium.bio/mcp`: name `Atlarium Habitat Database MCP`, version `2.0.0`, 39 tools, 9 prompts and 3 resources. After adding Zod parameter descriptions, redeploying and uploading the custom icon, quality score increased from `79/100` to `96/100`; parameter descriptions now show `39/39`. Settings use homepage `https://atlarium.bio/mcp` and repo `https://github.com/techgardeners/atlarium-mcp`. The `atlarium.bio` TXT and public backlinks in README and `/mcp` are live, and Smithery marks release, quality, homepage, TXT and backlink checks as passing. | Decide whether to upgrade Smithery for verified status; otherwise keep published/unverified with no badge. Avoid breaking public tool names only for the remaining naming heuristic. | Paid developer plan is the only visible verification blocker. |
| Glama | https://glama.ai/mcp/connectors/bio.atlarium/habitat-database | Ownership verified / listing healthy | Connector page returned HTTP 200 with title `Atlarium Habitat Database MCP - MCP Connector | Glama`, registry name, endpoint `https://mcp.atlarium.bio/mcp`, 39 tools, healthy status and Admin/Analytics access. `https://mcp.atlarium.bio/.well-known/glama.json` returns HTTP 200 with maintainer email `info@techgardeners.com`. | Monitor listing health and tool quality score; add badge/link only after badge policy approval. | None for ownership. |
| MCP.so | https://mcp.so/server/atlarium-habitat-database-mcp | Listed / visible; dashboard ownership mismatch | Public listing returns HTTP 200 with title `Atlarium Habitat Database MCP MCP Server`, canonical public read-only description and repository link `https://github.com/techgardeners/atlarium-mcp`. GitHub issue comment `4722425013` remains historical submission evidence. The signed-in `https://mcp.so/my-servers` dashboard for Roberto ilGrafico / `ilgrafico79@gmail.com` currently shows `No servers`; use the public listing as visibility evidence and track dashboard edit ownership separately. The shorter candidate slug `https://mcp.so/server/atlarium-habitat-database` still returns `Project not found`. | Monitor listing metadata and keep the `atlarium-habitat-database-mcp` URL in launch materials; ask MCP.so maintainers to attach the listing to the account only if dashboard edits are needed. | None for visibility; account linkage needed only for future dashboard edits. |
| PulseMCP | https://www.pulsemcp.com/servers/techgardeners-atlarium-habitat-database | Listed / visible | Public PulseMCP page shows `Atlarium Habitat Database`, provider `Tech Gardeners`, released `Jun 16, 2026`, `server.json file available`, registry name `bio.atlarium/habitat-database`, auth `Open`, transport `Streamable HTTP`, and cost `Free`. Automated curl from the audit environment can still return HTTP 403 because of Cloudflare. | Monitor the visible listing and keep server.json/registry metadata current before adding badges elsewhere. | None for visibility; automated checks may need browser/search fallback. |

Secondary directory backlog:

| Directory | URL | Status | Evidence | Next action |
| --- | --- | --- | --- | --- |
| MCP Scoreboard | https://www.mcpscoreboard.com/server/8fb9547d-bdb4-4fab-8218-ef13c1be32fc/ | Listed / unscored | Public listing shows Atlarium Habitat Database MCP, TechGardeners, GitHub and endpoint links, latest health check `Up`, and score `Unscored`. | Owner verification or remote scoring may require GitHub login; no score badge until the score is meaningful. |
| mcpservers.org | https://mcpservers.org/search | Submitted / pending review | Free form confirmed `Submission Successful` for `Atlarium Habitat Database MCP` and said review should happen within 12 hours. | Monitor approval email and listing URL; avoid badges until visible. |
| MCP Market | https://mcpmarket.com/submit | Blocked | Submission page is external; automated fetch can hit a Vercel checkpoint. | Browser/manual submission; paid acceleration optional, no badge until listing exists. |
| MCP Marketplace | https://mcp-marketplace.io/submit | Blocked | Search found no Atlarium listing; submit redirects to login. | Submit after login if this directory is worth prioritizing. |
| MCPRepository | https://mcprepository.com/techgardeners/atlarium-mcp | Submitted / queued | API accepted `https://github.com/techgardeners/atlarium-mcp` with `status: queued`, `valid: true`, `duplicate: false`, and returned the expected listing URL. | Verify the generated listing URL before adding a badge. |
| MCP Server Hub | https://mcpserverhub.com/submit | Submitted / pending review | Embedded Tally form confirmed `Form submitted` and `Thanks for your submission! We'll review and display your MCP Server later.` | Monitor public listing; avoid badges until visible. |

External review backlog:

| Surface | URL | Status | Evidence | Next action |
| --- | --- | --- | --- | --- |
| ChatGPT App | OpenAI Platform Apps review portal | Submitted / in review | Submission package uploaded with endpoint, privacy URL, app icon, screenshots, demo assets and read-only safety explanation. | Monitor review; if OpenAI requests changes, patch repo/docs/server, redeploy, rescan metadata and reply in the portal. |

## Directory Automation

Generate reusable copy and JSON payloads:

```bash
pnpm directories:submit -- --payload
```

Open the step-by-step cockpit for manual flows:

```text
docs/mcp-submission-cockpit.md
```

Check the public URLs and Official MCP Registry entry:

```bash
pnpm directories:submit -- --check
```

Open the web submission pages for OAuth/claim-based directories:

```bash
pnpm directories:submit -- --open
```

Historical MCP.so GitHub issue submission helper; use only for future refresh
comments if maintainers request them:

```bash
pnpm directories:submit -- --submit-mcp-so --yes
```
