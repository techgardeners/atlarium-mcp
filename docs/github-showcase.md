# GitHub Showcase Checklist

Use this checklist to keep the public GitHub repository credible without making
unsupported directory or client approval claims.

## Repository Metadata

Target values:

```text
Description: Public read-only MCP server for structured aquarium, marine, terrarium and paludarium habitat data.
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
```

Apply supported settings with:

```bash
gh repo edit techgardeners/atlarium-mcp \
  --description "Public read-only MCP server for structured aquarium, marine, terrarium and paludarium habitat data." \
  --homepage "https://atlarium.bio/mcp" \
  --enable-issues=true \
  --enable-wiki=false \
  --enable-projects=false \
  --enable-discussions=false \
  --add-topic mcp-server,remote-mcp,aquarium-data,habitat-planning,ai-tools
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

## Claim Rules

- Show the Official MCP Registry status because `bio.atlarium/habitat-database`
  is published and active.
- Do not add Smithery, MCP.so, PulseMCP or client approval badges until the
  external listing or approval is visible.
- Keep ChatGPT copy limited to submission/app-readiness notes until public
  review is complete.
