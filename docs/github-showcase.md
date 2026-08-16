# GitHub Showcase Checklist

Use this checklist to keep the public GitHub repository credible without making
unsupported directory or client approval claims.

## Repository Metadata

Target values:

```text
Description: Public read-only MCP server for Atlarium habitat data, diagnostics, calculators and advisory planning.
Homepage: https://atlarium.bio/mcp
Visibility: public
Issues: enabled
Discussions: disabled
Wiki: disabled
Projects: disabled
License: MIT
```

Recommended topics:

```text
mcp
mcp-server
model-context-protocol
remote-mcp
streamable-http
ai-agents
ai-tools
aquarium
aquarium-data
marine
terrarium
paludarium
habitat-data
habitat-planning
aquarium-calculators
diagnostics
fertilization
mcp-app
```

Apply supported settings with:

```bash
gh repo edit techgardeners/atlarium-mcp \
  --description "Public read-only MCP server for Atlarium habitat data, diagnostics, calculators and advisory planning." \
  --homepage "https://atlarium.bio/mcp" \
  --enable-issues=true \
  --enable-wiki=false \
  --enable-projects=false \
  --enable-discussions=false \
  --add-topic mcp-server,remote-mcp,aquarium-data,habitat-planning,ai-tools,aquarium-calculators,diagnostics,fertilization,mcp-app
```

Verify with:

```bash
gh repo view techgardeners/atlarium-mcp \
  --json description,homepageUrl,repositoryTopics,hasIssuesEnabled,hasWikiEnabled,hasProjectsEnabled,hasDiscussionsEnabled,usesCustomOpenGraphImage
```

## Social Preview

GitHub does not expose a supported `gh repo edit` or public REST/GraphQL field
for uploading a repository social preview image. Upload the prepared asset
manually:

```text
docs/assets/github-social-preview.png
```

Manual steps:

1. Open `https://github.com/techgardeners/atlarium-mcp/settings`.
2. Find **Social preview**.
3. Click **Edit**.
4. Upload `docs/assets/github-social-preview.png`.
5. Save and verify `usesCustomOpenGraphImage = true` with `gh repo view`.

## README Showcase

The README is the primary public GitHub landing page for MCP V2. Keep it
complete whenever the public MCP contract changes:

- Hero and badges for version, transport, tool count, prompts and auth.
- Client setup matrix for OpenAI Agents SDK, Claude Code, Cursor, Windsurf,
  VS Code, Antigravity, generic Streamable HTTP and ChatGPT Apps.
- ChatGPT App/widget section that distinguishes the approved existing `1.0.0`
  app from the deployed, not-yet-resubmitted Habitat Explorer v4 / MCP `2.0.2`.
- Tool surface table and one collapsible example for every public tool.
- Real ChatGPT web/mobile screenshots for publishing. Widget-only development
  captures can remain in the repo, but should not be uploaded for review.

Current development screenshot and demo assets:

```text
docs/assets/chatgpt-app-demo.mp4
docs/assets/chatgpt-screenshots/results.png
docs/assets/chatgpt-screenshots/profile.png
docs/assets/chatgpt-screenshots/compatibility.png
docs/assets/chatgpt-screenshots/suggestions.png
```

## Claim Rules

- Show the Official MCP Registry status because `bio.atlarium/habitat-database`
  `2.0.2` is published, active and latest.
- Do not add Smithery, MCP.so, PulseMCP or client approval badges until the
  external listing or approval is visible and badge policy is intentionally
  approved.
- Do not extend the existing `1.0.0` approval claim to Habitat Explorer v4 /
  MCP `2.0.2`; describe the candidate as pending resubmission until its own
  review is accepted.

## MCP Update Rule

Every MCP contract, version, tool, prompt, widget or public metadata change must
update the GitHub-facing README and repository presentation copy in the same
release. At minimum check `README.md`, `docs/mcp.md`,
`docs/github-showcase.md`, `server.json`, `docs/mcp/server-card.json.example`
and directory/submission payloads before publishing.
