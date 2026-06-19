# Atlarium MCP Directory Submission Payloads

Last verified: `2026-06-19T23:21:28Z`

Use these payloads for directory submission, claim and follow-up flows. Do not
add directory badges or claim official support until the specific directory
listing is visible or the vendor has accepted the submission.

## Canonical Metadata

Name:

```text
Atlarium Habitat Database MCP
```

Short description:

```text
Structured aquarium, marine, terrarium and paludarium data for AI agents.
```

Long description:

```text
Atlarium MCP is a public read-only MCP server that gives AI agents structured access to data for aquariums, marine tanks, coldwater systems, terrariums, paludariums and vivariums. It includes animals, plants, products, care requirements, environmental parameters, compatibility information, guides and habitat planning tools.
```

Connection:

```text
Transport: Streamable HTTP
Endpoint: https://mcp.atlarium.bio/mcp
Auth: none
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Repository: https://github.com/techgardeners/atlarium-mcp
Official MCP Registry: bio.atlarium/habitat-database
```

Safety statement:

```text
Atlarium Habitat Database MCP is read-only. It does not expose user accounts, workspaces, admin APIs, private data or write operations.
```

Suggested categories:

```text
Aquariums
Marine
Terrariums
Animals
Plants
Habitat planning
Research and data
```

## Server Config

```json
{
  "mcpServers": {
    "atlarium-habitat-database": {
      "type": "streamable-http",
      "url": "https://mcp.atlarium.bio/mcp"
    }
  }
}
```

## Official MCP Registry

Status: published / active.

Registry name:

```text
bio.atlarium/habitat-database
```

Evidence URL:

```text
https://registry.modelcontextprotocol.io/v0.1/servers?search=bio.atlarium%2Fhabitat-database
```

Future update payload is `server.json` at the repository root. Publish future
versions with the registry publisher after endpoint validation.

## Smithery

Submission URL:

```text
https://smithery.ai/new
```

Manual blocker:

```text
Requires Atlarium/TechGardeners sign-in. The submission page redirects to hosted Smithery auth.
```

Payload:

```text
Name: Atlarium Habitat Database MCP
Repository: https://github.com/techgardeners/atlarium-mcp
Remote endpoint: https://mcp.atlarium.bio/mcp
Transport: Streamable HTTP
Authentication: none
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Description: Structured aquarium, marine, terrarium and paludarium data for AI agents.
Safety: Public read-only tools only; no user, workspace, admin, auth or write APIs.
```

Verification after submission:

```bash
npx -y smithery mcp search "Atlarium Habitat Database MCP"
```

## Glama

Connector URL:

```text
https://glama.ai/mcp/connectors/bio.atlarium/habitat-database
```

Status:

```text
Indexed as a Glama MCP connector from the Official MCP Registry. The ownership claim file is live at `https://mcp.atlarium.bio/.well-known/glama.json`; complete the web claim flow if Glama still asks for manual confirmation.
```

Claim file to serve from the MCP domain:

```json
{
  "$schema": "https://glama.ai/mcp/schemas/connector.json",
  "maintainers": [
    {
      "email": "info@techgardeners.com"
    }
  ]
}
```

Live verification command:

```bash
curl --fail --silent --show-error https://mcp.atlarium.bio/.well-known/glama.json
```

## MCP.so

Submission evidence:

```text
https://github.com/chatmcp/mcpso/issues/1#issuecomment-4722425013
```

Status:

```text
Submitted through MCP.so public GitHub issue flow on 2026-06-16T19:06:21Z. Public listing not visible during the 2026-06-19 check.
```

Follow-up payload if maintainers request a refresh:

```text
Atlarium Habitat Database MCP

Structured aquarium, marine, terrarium and paludarium data for AI agents.

Transport: Streamable HTTP
Endpoint: https://mcp.atlarium.bio/mcp
Auth: none
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Repository: https://github.com/techgardeners/atlarium-mcp
Official MCP Registry: bio.atlarium/habitat-database

Safety: read-only; no user accounts, workspaces, admin APIs, private data or write operations.
```

## PulseMCP

Submission URL:

```text
https://www.pulsemcp.com/submit
```

Manual blocker:

```text
Automated checks from the audit environment returned HTTP 403 Cloudflare block. Use a browser or email follow-up if registry ingestion does not surface the listing.
```

Email payload:

```text
To: hello@pulsemcp.com
Subject: Atlarium Habitat Database MCP listing / registry sync

Hello PulseMCP team,

Could you please confirm that the following public remote MCP server is queued for PulseMCP indexing?

Name: Atlarium Habitat Database MCP
Description: Structured aquarium, marine, terrarium and paludarium data for AI agents.
Transport: Streamable HTTP
Endpoint: https://mcp.atlarium.bio/mcp
Auth: none
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Repository: https://github.com/techgardeners/atlarium-mcp
Official MCP Registry: bio.atlarium/habitat-database
Safety: public read-only tools only; no user, workspace, admin or write APIs.

Thank you.
```
