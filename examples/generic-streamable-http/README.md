# Generic Streamable HTTP MCP Example

Use these checks for any MCP client that can connect to a remote Streamable HTTP
server.

## Health

```bash
curl --fail --silent --show-error https://mcp.atlarium.bio/health
```

## Initialize

```bash
curl --fail --silent --show-error \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"generic-client","version":"0.0.1"}}}' \
  https://mcp.atlarium.bio/mcp
```

## Public Validation

From the repository root:

```bash
pnpm mcp:validate:public
```
