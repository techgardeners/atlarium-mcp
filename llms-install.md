# Install Atlarium Habitat Database MCP

Atlarium is a hosted, public, read-only MCP server. Do not clone, build or run a
local process for client installation. It requires no API key and no Atlarium
account.

## Canonical connection

- Name: `atlarium`
- Transport: Streamable HTTP
- URL: `https://mcp.atlarium.bio/mcp`
- Authentication: none

Use this client configuration when JSON configuration is supported:

```json
{
  "mcpServers": {
    "atlarium": {
      "type": "streamableHttp",
      "url": "https://mcp.atlarium.bio/mcp"
    }
  }
}
```

If the client uses `http` rather than `streamableHttp` as the type label,
keep the same URL and select its remote HTTP transport.

## Cline

In Cline, open MCP Servers, choose Remote Servers, set the name to `atlarium`,
select Streamable HTTP and enter the canonical URL. For direct JSON
configuration use the block above. Do not add headers, tokens, environment
variables or automatic write approvals.

## Cursor

Open the following deep link or use the repository's `mcp.json`:

```text
cursor://anysphere.cursor-deeplink/mcp/install?name=atlarium&config=eyJ1cmwiOiJodHRwczovL21jcC5hdGxhcml1bS5iaW8vbWNwIn0=
```

## Verification

1. Confirm `https://mcp.atlarium.bio/health` returns `status: ok`.
2. Connect to the MCP endpoint and confirm exactly 39 tools and 9 prompts.
3. Call `search_fish` with `{"query":"neon tetra","language":"en","limit":1}`.
4. Treat all compatibility, diagnostic, fertilization and calculator output as
   advisory.

The server exposes only public data and read-only operations. It does not expose
accounts, private workspaces, authentication, admin APIs or write tools.
