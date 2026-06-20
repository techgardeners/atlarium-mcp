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
- ChatGPT App/widget section with accurate status and no public approval claim.
- Tool surface table and one collapsible example for every public tool.
- Real widget screenshots only after capture from ChatGPT Developer Mode or an
  equivalent live Apps-compatible host.

Expected screenshot filenames, once captured:

```text
docs/assets/chatgpt-app-results.png
docs/assets/chatgpt-app-profile.png
docs/assets/chatgpt-app-planner.png
```

## Claim Rules

- Show the Official MCP Registry status because `bio.atlarium/habitat-database`
  is published and active. Do not imply a V2 registry refresh until the updated
  `server.json` is published and visible.
- Do not add Smithery, MCP.so, PulseMCP or client approval badges until the
  external listing or approval is visible.
- Keep ChatGPT copy limited to submission/app-readiness notes until public
  review is complete.

## MCP Update Rule

Every MCP contract, version, tool, prompt, widget or public metadata change must
update the GitHub-facing README and repository presentation copy in the same
release. At minimum check `README.md`, `docs/mcp.md`,
`docs/github-showcase.md`, `server.json`, `docs/mcp/server-card.json.example`
and directory/submission payloads before publishing.
