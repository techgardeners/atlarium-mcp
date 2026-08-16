# Atlarium MCP Directory Submission Payloads

Last verified: `2026-08-16T20:52:52Z`

Use these payloads for directory submission, claim and follow-up flows. Do not
add directory badges or claim official support until the specific directory
listing is visible or the vendor has accepted the submission.

For the operational status board and manual blocker list, use
`docs/mcp-submission-cockpit.md`.

## Canonical Metadata

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
Diagnostics
Fertilization
Calculators
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

Current evidence:

```text
Registry API returns bio.atlarium/habitat-database version 2.0.2 with official status active, publishedAt 2026-08-16T23:10:31.800325Z and isLatest true. Use `pnpm registry:publish` for future versions after public endpoint validation.
```

## Smithery

Submission URL:

```text
https://smithery.ai/new
```

Manual blocker:

```text
Published and visible at `ilgrafico79/atlarium-habitat-database`. Production
exposes version 2.0.2 with 39 tools, 9 prompts and 4 widget resources. Complete a
signed-in metadata refresh after runtime changes; do not publish a static score
or purchase paid verification.
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
Description: Structured habitat data and advisory tools for aquariums, marine tanks, terrariums and paludariums.
Surface: 39 public read-only tools for catalog data, diagnostics, products, fertilization, calculators, compatibility and habitat planning.
Safety: Public read-only tools only; no user, workspace, admin, auth or write APIs.
```

Verification after submission:

```bash
npx -y smithery mcp search "Atlarium Habitat Database MCP"
```

If `https://smithery.ai/new` fails after sign-in, navigate from Smithery's
Publish flow and enter the public HTTPS endpoint manually.

## Glama

Connector URL:

```text
https://glama.ai/mcp/connectors/bio.atlarium/habitat-database
```

Status:

```text
Ownership verified. Glama indexes the connector from the Official MCP Registry,
the claim file is live at `https://mcp.atlarium.bio/.well-known/glama.json`,
the listing is healthy, Admin/Analytics are available, and the public
description uses the canonical V2 copy.
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
https://github.com/chatmcp/mcpso/issues/1#issuecomment-5309572262
```

Status:

```text
The public listing is visible at https://chat.mcp.so/server/atlarium-habitat-database-mcp/techgardeners. Release 2.0.2 metadata was submitted through the canonical GitHub issue on 2026-08-16. Treat public visibility and owner-dashboard linkage as separate states; no submitter contact data belongs in this document.
```

Follow-up payload if maintainers request a refresh:

```text
Atlarium Habitat Database MCP

Structured habitat data and advisory tools for aquariums, marine tanks, terrariums and paludariums.

Transport: Streamable HTTP
Endpoint: https://mcp.atlarium.bio/mcp
Auth: none
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Repository: https://github.com/techgardeners/atlarium-mcp
Official MCP Registry: bio.atlarium/habitat-database

Surface: 39 public read-only tools for catalog data, diagnostics, products, fertilization, calculators, compatibility and habitat planning.
Safety: read-only; no user accounts, workspaces, admin APIs, private data or write operations.
```

Ownership/editing follow-up if the MCP.so dashboard still shows no servers:

```text
Hi MCP.so team,

The Atlarium Habitat Database MCP listing is publicly visible at:
https://chat.mcp.so/server/atlarium-habitat-database-mcp/techgardeners

However, the signed-in maintainer dashboard at https://mcp.so/my-servers still
shows no attached server, so the listing cannot be edited from the owner
dashboard.

Could you attach this listing to the signed-in account?

Evidence:
- Public MCP endpoint: https://mcp.atlarium.bio/mcp
- Health: https://mcp.atlarium.bio/health
- Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
- GitHub repo: https://github.com/techgardeners/atlarium-mcp
- Official registry name: bio.atlarium/habitat-database
- Historical submission evidence:
  https://github.com/chatmcp/mcpso/issues/1#issuecomment-5309572262
```

## MCP Scoreboard

Listing URL:

```text
https://www.mcpscoreboard.com/server/8fb9547d-bdb4-4fab-8218-ef13c1be32fc/
```

Status:

```text
Listed / unscored. The public listing shows Atlarium Habitat Database MCP,
TechGardeners, GitHub and endpoint links, and latest health status Up. Do not
add a score badge while the listing is unscored.
```

Owner/scoring request payload:

```text
Atlarium Habitat Database MCP

Repository: https://github.com/techgardeners/atlarium-mcp
Endpoint: https://mcp.atlarium.bio/mcp
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Official MCP Registry: bio.atlarium/habitat-database

The server is public, remote Streamable HTTP, auth none and read-only. It
exposes 39 public read-only tools, 9 prompts and the Apps-compatible Habitat
Explorer widget resource. Please refresh scoring from the current live endpoint
and server-card metadata.
```

Manual blocker:

```text
Owner verification or scoring request may require GitHub login from a
TechGardeners maintainer.
```

## mcpservers.org

Listing URL:

```text
https://mcpservers.org/servers/techgardeners/atlarium-mcp
```

Status:

```text
Listed / visible. The public listing returns HTTP 200 and includes "Atlarium Habitat Database MCP", the canonical endpoint https://mcp.atlarium.bio/mcp, repository, docs, server card and 39-tool read-only surface.
```

Payload:

```text
Name: Atlarium Habitat Database MCP
Project URL: https://github.com/techgardeners/atlarium-mcp
Endpoint: https://mcp.atlarium.bio/mcp
Transport: Streamable HTTP
Auth: none
Description: Structured habitat data and advisory tools for aquariums, marine tanks, terrariums and paludariums.
Surface: 39 public read-only tools for catalog data, diagnostics, products, fertilization, calculators, compatibility and habitat planning.
Safety: read-only; no user accounts, workspaces, admin APIs, private data or write operations.
```

Use this accepted listing as secondary evidence in follow-ups for directories
that are still queued or pending:

```text
Accepted public directory listing:
https://mcpservers.org/servers/techgardeners/atlarium-mcp
```

## MCPRepository

Submission URL:

```text
https://mcprepository.com/techgardeners/atlarium-mcp
```

Status:

```text
Published / visible. The public page https://mcprepository.com/techgardeners/atlarium-mcp returns HTTP 200 with the Atlarium title.
```

Payload:

```text
Name: Atlarium Habitat Database MCP
GitHub repository: https://github.com/techgardeners/atlarium-mcp
Remote MCP endpoint: https://mcp.atlarium.bio/mcp
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Official MCP Registry: bio.atlarium/habitat-database
Tags: aquarium, marine, terrarium, paludarium, habitat-data, diagnostics, fertilization, calculators, mcp-app
```

No queue follow-up is required while the public page remains visible.

## MCP Server Hub

Submission URL:

```text
https://mcpserverhub.com/submit
```

Status:

```text
Submitted / pending review. The MCP Server Hub embedded Tally form confirmed "Form submitted" and "Thanks for your submission! We'll review and display your MCP Server later." No public listing is accepted until it is visible.
```

Payload:

```text
Name: Atlarium Habitat Database MCP
Contact: info@techgardeners.com
Repository: https://github.com/techgardeners/atlarium-mcp
Endpoint: https://mcp.atlarium.bio/mcp
Transport: Streamable HTTP
Authentication: none
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Description: Atlarium MCP is a public read-only MCP server for structured aquarium, marine, terrarium and paludarium habitat data, diagnostics, products, fertilization, calculators, compatibility and advisory habitat planning.
```

Follow-up payload if the listing remains absent from public search:

```text
Hi MCP Server Hub team,

We submitted Atlarium Habitat Database MCP through the embedded Tally form and
received the "Form submitted" confirmation, but the server is still not visible
in public search.

Could you please confirm whether it is still queued for review?

Evidence:
- Repository: https://github.com/techgardeners/atlarium-mcp
- Public MCP endpoint: https://mcp.atlarium.bio/mcp
- Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
- Docs: https://atlarium.bio/mcp
- Official registry: bio.atlarium/habitat-database
- Accepted mcpservers.org listing:
  https://mcpservers.org/servers/techgardeners/atlarium-mcp
```

## MCP Market / Marketplace

Submission URLs:

```text
https://mcpmarket.com/submit
https://mcp-marketplace.io/submit
```

Status:

```text
Blocked / manual. These flows can require login or hit anti-bot checkpoints.
Use a logged-in browser and keep the status pending until a public listing is
visible.
```

Payload:

```text
Name: Atlarium Habitat Database MCP
Endpoint: https://mcp.atlarium.bio/mcp
Repository: https://github.com/techgardeners/atlarium-mcp
Docs: https://atlarium.bio/mcp
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Short description: Structured habitat data and advisory tools for aquariums, marine tanks, terrariums and paludariums.
Safety: public read-only tools only; no user, workspace, admin, auth or write APIs.
```

## PulseMCP

Visible listing:

```text
https://www.pulsemcp.com/servers/techgardeners-atlarium-habitat-database
```

Submission URL for future corrections:

```text
https://www.pulsemcp.com/submit
```

Operational note:

```text
The public listing is visible, but automated checks from some audit environments can still return HTTP 403 because of Cloudflare. Use a browser or search fallback before assuming the listing disappeared.
```

Email payload if maintainers request a correction:

```text
To: hello@pulsemcp.com
Subject: Atlarium Habitat Database MCP listing / registry sync

Hello PulseMCP team,

Could you please confirm that the following public remote MCP server is queued for PulseMCP indexing?

Name: Atlarium Habitat Database MCP
Description: Structured habitat data and advisory tools for aquariums, marine tanks, terrariums and paludariums.
Transport: Streamable HTTP
Endpoint: https://mcp.atlarium.bio/mcp
Auth: none
Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
Docs: https://atlarium.bio/mcp
Repository: https://github.com/techgardeners/atlarium-mcp
Official MCP Registry: bio.atlarium/habitat-database
Surface: 39 public read-only tools for catalog data, diagnostics, products, fertilization, calculators, compatibility and habitat planning.
Safety: public read-only tools only; no user, workspace, admin or write APIs.

Thank you.
```
