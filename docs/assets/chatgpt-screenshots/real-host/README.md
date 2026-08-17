# Real ChatGPT host captures

Captured on `2026-08-16` from the signed-in ChatGPT web host against the
approved Atlarium app version `1.0.0` and the live MCP `2.0.3` endpoint. The
separate App version `2.0.3` remains a draft and is not approved.

| File | Evidence |
| --- | --- |
| `search-fish-web.jpg` | ChatGPT web, direct `search_fish`, real species images and five public results. |
| `fish-profile-web.jpg` | ChatGPT web, direct `get_fish_profile`, real Neon Tetra image, metrics and section hierarchy. |
| `fish-profile-mobile-390x844.jpg` | ChatGPT host at a 390x844 responsive viewport, proving the compact profile layout. |
| `compatibility-web.jpg` | ChatGPT web after Developer Mode metadata refresh, direct Italian compatibility result with localized summary, warnings, actions and disclaimer. |

These are host-level review captures, not the deterministic widget-only
fixtures stored in the parent directory. The responsive image is not evidence
of native iOS or Android execution; native mobile recording remains part of
the final OpenAI submission checkpoint.

The first combined natural-language run called both `search_fish` and
`get_fish_profile`. The search widget rendered, while ChatGPT showed one
`Failed to fetch template` notice for the concurrent profile render. A direct
single-tool `get_fish_profile` call immediately rendered the profile correctly.
The production usage report for the same window recorded zero request and tool
errors, while the `2.0.3` draft endpoint rescan found all 39 tools. The cause of
the host notice is not determined. Repeat this combined case after the draft
metadata refresh and stop submission if it recurs.

OpenAI publishing crops live in the sibling `../submission/` directory. They
are derived from these real-host captures without synthetic content, are 706px
wide, stay within 400–860px high and exclude the user prompt.
