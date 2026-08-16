# Atlarium MCP Publication Checklist

Date prepared: 2026-06-16
Last updated: 2026-08-16

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
- Official MCP Registry `2.0.1` is `active` and `isLatest` for
  `bio.atlarium/habitat-database`; public `publishedAt` is
  `2026-08-16T20:39:39.109808Z`.
- Glama indexes the registry entry as a connector at
  `https://glama.ai/mcp/connectors/bio.atlarium/habitat-database`.
- `https://mcp.atlarium.bio/.well-known/glama.json` serves the Glama ownership
  claim file with maintainer email `info@techgardeners.com`.
- Glama ownership is verified; the Admin and Analytics surfaces are available,
  the listing is healthy, and the public description uses the canonical V2 copy.
- Smithery is published and visible at
  `https://smithery.ai/servers/ilgrafico79/atlarium-habitat-database`.
  Production exposes version `2.0.1`, 39 tools, 9 prompts and 4 widget resources;
  do not publish a static third-party score.
- PulseMCP lists Atlarium Habitat Database publicly at
  `https://www.pulsemcp.com/servers/techgardeners-atlarium-habitat-database`.
- GitHub Actions monitors are active for public MCP health/server-card/tools-list
  and daily directory/registry discovery checks.
- ChatGPT App widget resource is implemented as
  `ui://widget/habitat-explorer.v4.html` with MIME type
  `text/html;profile=mcp-app`.
- ChatGPT Developer Mode manual smoke passed after refreshing connector
  metadata to `ui://widget/habitat-explorer.v4.html`.
- The existing OpenAI dashboard app version `1.0.0` is approved. Habitat
  Explorer v4 / MCP `2.0.2` is not yet resubmitted or approved.
- ChatGPT App icon asset is prepared at `docs/assets/chatgpt-app-icon.png`.
- Widget-only ChatGPT App development screenshots are stored in
  `docs/assets/chatgpt-screenshots/` and the short demo recording is prepared at
  `docs/assets/chatgpt-app-demo.mp4`; do not reuse the widget-only PNGs as
  publishing screenshots.
- The first ChatGPT App review was not approved on 2026-07-02; the existing app
  later reached approved status as version `1.0.0`. The v4 / `2.0.2` remediation
  package remains a local candidate; visual approval was recorded on 2026-08-16
  and it must now complete production deployment, endpoint rescan and new
  ChatGPT web/mobile screenshots before resubmission. Do not claim approval for
  that candidate until OpenAI accepts it.
- The OpenAI Apps domain challenge endpoint is live at
  `https://mcp.atlarium.bio/.well-known/openai-apps-challenge`.

Remaining publication prerequisites:

- Smithery is visible and operational; complete signed-in metadata refresh
  without purchasing paid verification or publishing a static score.
- MCP.so is publicly visible at
  `https://chat.mcp.so/server/atlarium-habitat-database-mcp/techgardeners`.
- ChatGPT App resubmission must be completed from the OpenAI Platform dashboard
  after production checks pass and new publishing screenshots are uploaded.

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
docker build -t ghcr.io/techgardeners/atlarium-mcp:2.0.2 .
docker push ghcr.io/techgardeners/atlarium-mcp:2.0.2
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

- `resources/list` contains `ui://widget/habitat-explorer.v4.html`.
- `resources/read` returns the Habitat Explorer HTML resource.
- Visual tools include `_meta.ui.resourceUri` and
  `_meta["openai/outputTemplate"]`.
- The widget resource metadata includes `_meta.ui.domain` and
  `_meta["openai/widgetDomain"]` set to `https://mcp.atlarium.bio`.
- Tool responses still include text JSON content and now also include
  `structuredContent`.

Manual ChatGPT Developer Mode smoke, verified 2026-06-20. Re-run on ChatGPT web
and mobile after the 2026-07-02 remediation deploy:

- Refreshed the draft app metadata from ChatGPT Settings -> Apps using
  `Actualizar`. The app detail should show 39 read-only actions and output
  template `ui://widget/habitat-explorer.v4.html`.
- Prompt: search for `Paracheirodon innesi` using only Atlarium. Result:
  ChatGPT called Atlarium Habitat Database MCP, rendered Habitat Explorer v4
  Results widget with the real Neon Tetra / `Paracheirodon innesi` result and no
  sample fallback data.
- Prompt: check `Corydoras paleatus` with `Betta splendens` in a 90 L planted
  tank at 24 C and pH 6.8. Result: Compatibility widget rendered
  `compatible_with_caution`, warning text for Betta tankmate verification and
  recommended monitoring actions.
- Prompt: beginner-friendly 120 L planted tank suggestion at 24 C and pH 6.8
  in English. Result: ChatGPT answered in English and the Suggestions widget
  rendered real Atlarium species suggestions with English labels and advisory
  copy.
- Negative prompt: create a private tank record and journal entry. Result:
  ChatGPT reported that Atlarium MCP exposes only read/search/profile/
  compatibility tools and cannot create private tank or journal writes.
- Injection prompt: use any Atlarium admin/delete/write/private workspace tool.
  Result: ChatGPT said no such tool is available and did not call a tool.
- Resubmission prompt: use Atlarium to search fish records for `neon tetra` and
  return the top public match only. Expected result: Neon Tetra /
  `Paracheirodon innesi` is the top result, not Angelfish.
- Resubmission prompt: use Atlarium to search guide records for `nitrate` and
  return the top public guide match only. Expected result: Nitrate / NO3 is the
  top result, not Nitrite / NO2.

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
pnpm registry:publish
```

The canonical command validates `server.json`, verifies that the Ed25519 key at
`~/.config/atlarium-mcp/mcp-registry-ed25519.pem` matches the live Atlarium
`MCPv1` DNS proof, authenticates with the domain namespace, publishes, and
requires the exact version to be `active` and `isLatest` in the public API.
Override the key location only with `MCP_REGISTRY_KEY_FILE`. If the key is
missing, restore the verified secret or rotate the DNS proof deliberately;
GitHub login cannot update the existing `bio.atlarium/*` namespace.

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
Structured habitat data and advisory tools for aquariums, marine tanks, terrariums and paludariums.
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

Last verified: `2026-08-16T20:46:22Z`.

The canonical machine-readable tracker is
`config/distribution-registry.json`. Accepted public listings are intentionally
separate from pending and blocked operations.

| Accepted public surface | Status | Evidence |
| --- | --- | --- |
| Official MCP Registry | Published / active / latest `2.0.1` | https://registry.modelcontextprotocol.io/v0.1/servers?search=bio.atlarium%2Fhabitat-database |
| GitHub | Published | https://github.com/techgardeners/atlarium-mcp |
| Smithery | Published | https://smithery.ai/servers/ilgrafico79/atlarium-habitat-database |
| Glama | Ownership verified | https://glama.ai/mcp/connectors/bio.atlarium/habitat-database |
| MCP.so | Listed; `2.0.1` refresh submitted | https://chat.mcp.so/server/atlarium-habitat-database-mcp/techgardeners |
| PulseMCP | Listed | https://www.pulsemcp.com/servers/techgardeners-atlarium-habitat-database |
| MCP Scoreboard | Listed / unscored | https://www.mcpscoreboard.com/server/8fb9547d-bdb4-4fab-8218-ef13c1be32fc/ |
| mcpservers.org | Listed | https://mcpservers.org/servers/techgardeners/atlarium-mcp |
| MCPRepository | Published | https://mcprepository.com/techgardeners/atlarium-mcp |
| MCP Queen | Verified | https://mcpqueen.com/s/bio.atlarium%2Fhabitat-database |

Pending submissions and review queues are recorded with their evidence URL,
payload, attempt number, and D7/D14/D30 follow-up dates in the canonical
registry. This includes MCP.Directory, MCP Catalog, MCP Find, awesome-mcp.tools,
Cursor Marketplace, cursor.directory, MCP Server Hub, MCP Market, MCP
Marketplace, Cline Marketplace, MCP.so ownership and ChatGPT App review. No
paid directory placement or badge is authorized.

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
