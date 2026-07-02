# ChatGPT App Review Remediation

Last updated: `2026-07-02`

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
- The checked-in screenshots under `docs/assets/chatgpt-screenshots/` are
  widget-only captures. They are useful development evidence, but they are not
  sufficient publishing screenshots because review screenshots must show the
  actual in-ChatGPT app experience and meet the dashboard dimensions.

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

Use new screenshots captured from ChatGPT itself, not the widget-only PNGs in
`docs/assets/chatgpt-screenshots/`.

Required capture set for resubmission:

- ChatGPT web conversation showing the Atlarium app enabled and a `search_fish`
  tool result for `neon tetra`, with Neon Tetra as the top result.
- ChatGPT web conversation showing `check_species_compatibility` for Corydoras
  paleatus and Betta splendens.
- ChatGPT web conversation showing `suggest_species_for_tank` cards or textual
  suggestions.
- ChatGPT mobile capture for one positive case, confirming the same result and
  readable widget/layout.
- ChatGPT negative prompt capture showing no private/write/admin tool is called.

Before uploading, verify each image matches the dimensions required by the
OpenAI Platform dashboard and that it includes the ChatGPT host UI, not only the
embedded widget.

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
2. Replace old screenshots with new ChatGPT web/mobile screenshots.
3. Upload the updated `chatgpt-app-submission.json` content or copy the revised
   test prompts and expected outputs into the form.
4. Submit for review.

Do not claim ChatGPT approval until OpenAI accepts the resubmission.
