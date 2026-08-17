# ChatGPT App Review Remediation

Last updated: `2026-08-16`

Current status: the existing OpenAI dashboard app version `1.0.0` is approved.
This document records the earlier review findings and the remaining submission
work for Habitat Explorer v4 / MCP `2.0.3`. A signed-in draft exists and its MCP
endpoint has been rescanned, but it is not yet submitted or approved.

OpenAI rejected the Atlarium Habitat Database MCP ChatGPT App review with two
action items:

- One or more submitted test cases did not produce the expected result.
- Uploaded screenshots did not meet publishing requirements.

## Root Causes Found

- The submitted test cases grouped several tools into each prompt, which made
  the expected `tools_triggered` values too fragile for ChatGPT web/mobile
  review runs.
- `search_fish` could return description-only matches before exact common-name
  matches. Example: `neon tetra` could rank Angelfish above Neon Tetra because
  the Angelfish description mentions Neon Tetras.
- `search_guides` could rank Nitrite above Nitrate for the query `nitrate`
  because the upstream search result page needed exact-title post-ranking.
- The deterministic screenshots directly under
  `docs/assets/chatgpt-screenshots/` are widget-only captures. They are useful
  development evidence, but they are not sufficient publishing screenshots
  because review screenshots must show the actual in-ChatGPT app experience.
- Real ChatGPT host captures now live in
  `docs/assets/chatgpt-screenshots/real-host/`. They cover web search, web
  profile and a responsive 390x844 profile; native iOS/Android recording is
  still outstanding.

## Code And Submission Fixes

- Public search results are post-ranked so exact or strong name/title/slug
  matches beat long-description matches.
- Tool `structuredContent` no longer includes a non-essential generated
  timestamp.
- `chatgpt-app-submission.json` now contains five single-tool positive tests and
  three negative tests.
- `pnpm chatgpt:validate-submission` validates the JSON shape, live tool list
  and deterministic tool outputs for all submitted positive cases.

## Resubmission Screenshot Requirements

Use the host captures in `docs/assets/chatgpt-screenshots/real-host/`, not the
widget-only fixtures directly under `docs/assets/chatgpt-screenshots/`.

Required capture set for resubmission:

- ChatGPT web conversation showing the Atlarium app enabled and a `search_fish`
  tool result for `neon tetra`, with Neon Tetra as the top result. Captured.
- ChatGPT web conversation showing a direct `get_fish_profile` result with the
  real species image and readable chapter hierarchy. Captured.
- ChatGPT web conversation showing `check_species_compatibility` for Corydoras
  paleatus and Betta splendens. Captured in Italian after refreshing the
  Developer Mode connector metadata.
- ChatGPT web conversation showing `suggest_species_for_tank` cards or textual
  suggestions.
- ChatGPT responsive 390x844 capture for one positive case, confirming the same
  result and readable widget/layout. Captured; native mobile recording remains.
- ChatGPT negative prompt capture showing no private/write/admin tool is called.

The three prepared publishing crops in
`docs/assets/chatgpt-screenshots/submission/` are 706px wide, 650–860px high,
contain the real ChatGPT-hosted widget and exclude the user prompt.

The first combined search-plus-profile host run displayed one
`Failed to fetch template` notice for the concurrent profile render. A direct
single-tool profile call then rendered correctly and the production usage
report showed zero request/tool errors. The cause is not determined. Repeat the
combined case after the draft metadata refresh and do not submit if it recurs.

## Validation Commands

Run before resubmission:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm mcp:monitor:public
pnpm mcp:validate:public
pnpm chatgpt:validate-submission
```

Run manual review in ChatGPT web and mobile after refreshing the draft app
metadata from the OpenAI Platform dashboard.

## Production Validation Evidence

Validation passed against `https://mcp.atlarium.bio/mcp` on `2026-07-02`:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
PUSH_IMAGE=true pnpm pipeline:local
pnpm deploy:spartaco
pnpm mcp:monitor:public
pnpm directories:submit -- --check
pnpm mcp:validate:public
pnpm mcp:conformance:public
pnpm chatgpt:validate-submission
```

Live payload check:

```text
search_fish("neon tetra", limit: 1) -> Neon Tetra / paracheirodon-innesi
structuredContent keys -> data, tool
generated_at -> absent
```

## Dashboard Steps

1. In the OpenAI Platform Apps dashboard, refresh or rescan the MCP endpoint.
   Completed for the `2.0.3` draft on `2026-08-16`; 39 tools were discovered.
2. Upload the host-level captures and add native mobile recording evidence.
3. Upload the updated `chatgpt-app-submission.json` content or copy the revised
   test prompts and expected outputs into the form.
4. Submit for review.

Do not claim Habitat Explorer v4 / MCP `2.0.3` approval until OpenAI accepts
that resubmission; this does not change the approved status of the existing
dashboard app version `1.0.0`.
