# Atlarium MCP Directory Submission Payloads

Last verified: `2026-06-20`

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
Structured aquarium, marine, terrarium and paludarium data and public advisory functions for AI agents.
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
Registry API previously returned metadata.count = 1, server.name = bio.atlarium/habitat-database, official status active, publishedAt = 2026-06-16T10:01:55.780369Z and isLatest = true under _meta.io.modelcontextprotocol.registry/official. For V2, publish the updated `server.json` with version 2.0.0 after public endpoint validation.
```

## Smithery

Submission URL:

```text
https://smithery.ai/new
```

Manual blocker:

```text
Published and visible at `ilgrafico79/atlarium-habitat-database`. The latest
release succeeded and Smithery discovered version 2.0.0 with 39 tools, 9
prompts and 3 resources. Quality score is 96/100 after parameter descriptions
and custom icon upload; `Parameter descriptions` shows 39/39. The remaining
score gap is Smithery's non-breaking naming heuristic.
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
Description: Structured aquarium, marine, terrarium and paludarium data and public advisory functions for AI agents.
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
https://github.com/chatmcp/mcpso/issues/1#issuecomment-4722425013
```

Status:

```text
Submitted through MCP.so public GitHub issue flow on 2026-06-16T19:06:21Z and through the MCP.so UI on 2026-06-20 after maintainer sign-in. The public listing is visible at https://mcp.so/server/atlarium-habitat-database-mcp and returns HTTP 200 with title "Atlarium Habitat Database MCP MCP Server", the canonical public read-only description and the GitHub repository link. The signed-in `https://mcp.so/my-servers` dashboard for Roberto ilGrafico / `ilgrafico79@gmail.com` currently shows `No servers`, so treat the public listing URL as canonical visibility evidence and treat dashboard ownership/edit access as a separate follow-up. The older candidate slug https://mcp.so/server/atlarium-habitat-database still returns "Project not found"; use the `atlarium-habitat-database-mcp` slug.
```

Follow-up payload if maintainers request a refresh:

```text
Atlarium Habitat Database MCP

Structured aquarium, marine, terrarium and paludarium data and public advisory functions for AI agents.

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
https://mcp.so/server/atlarium-habitat-database-mcp

However, when signed in as Roberto ilGrafico / ilgrafico79@gmail.com, the
https://mcp.so/my-servers dashboard still shows "No servers", so we cannot edit
or refresh the listing from the owner dashboard.

Could you attach this listing to the signed-in account?

Evidence:
- Public MCP endpoint: https://mcp.atlarium.bio/mcp
- Health: https://mcp.atlarium.bio/health
- Server card: https://mcp.atlarium.bio/.well-known/mcp/server-card.json
- GitHub repo: https://github.com/techgardeners/atlarium-mcp
- Official registry name: bio.atlarium/habitat-database
- Historical submission evidence:
  https://github.com/chatmcp/mcpso/issues/1#issuecomment-4722425013
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

Submission/search URL:

```text
https://mcpservers.org/search
```

Status:

```text
Submitted / pending review. The free submission form confirmed "Submission Successful" for "Atlarium Habitat Database MCP" and said the submission will be reviewed within 12 hours. No public listing is accepted until the listing URL is visible.
```

Payload:

```text
Name: Atlarium Habitat Database MCP
Project URL: https://github.com/techgardeners/atlarium-mcp
Endpoint: https://mcp.atlarium.bio/mcp
Transport: Streamable HTTP
Auth: none
Description: Structured aquarium, marine, terrarium and paludarium data and public advisory functions for AI agents.
Surface: 39 public read-only tools for catalog data, diagnostics, products, fertilization, calculators, compatibility and habitat planning.
Safety: read-only; no user accounts, workspaces, admin APIs, private data or write operations.
```

## MCPRepository

Submission URL:

```text
https://mcprepository.com/techgardeners/atlarium-mcp
```

Status:

```text
Submitted / queued. The MCPRepository API accepted https://github.com/techgardeners/atlarium-mcp with status "queued", valid true, duplicate false, and returned the expected listing URL https://mcprepository.com/techgardeners/atlarium-mcp. Verify that page before adding any badge.
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
Short description: Structured aquarium, marine, terrarium and paludarium data and public advisory functions for AI agents.
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
Description: Structured aquarium, marine, terrarium and paludarium data and public advisory functions for AI agents.
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
