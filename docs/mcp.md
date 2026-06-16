# Atlarium MCP

## Overview

Atlarium MCP is a public, read-only MCP server for structured freshwater
aquarium data from Atlarium.bio. It is designed for future publication in MCP
directories, but this repository does not publish or submit the server anywhere.

Conceptual description:

> Atlarium MCP gives AI agents structured access to freshwater aquarium fish,
> aquatic plants, water parameters, compatibility data and aquarium planning
> information.

## Endpoints

Development:

- `GET http://localhost:43118/health`
- `POST http://localhost:43118/mcp`

Production target:

- `https://mcp.atlarium.bio/mcp`

Fallback if the MCP subdomain is not available:

- `https://atlarium.bio/mcp`

The server consumes the public Atlarium data provider:

- `https://atlarium.bio/api/public/mcp/v1`

## Transport

The server uses MCP Streamable HTTP via `@modelcontextprotocol/sdk`.

## Tools

- `search_fish`: search freshwater aquarium fish.
- `get_fish_profile`: get a structured fish profile.
- `search_plants`: search aquatic plants.
- `get_plant_profile`: get a structured plant profile.
- `search_products`: search aquarium products.
- `get_product_profile`: get a structured product profile.
- `check_species_compatibility`: prudently evaluate basic species compatibility.
- `get_water_parameters`: get recommended water parameters for a fish or plant.
- `suggest_species_for_tank`: suggest fish for a freshwater aquarium setup.
- `search_guides`: search guide and educational content.
- `get_guide`: get a structured guide.

## Security

- No login is required in v1.
- No write, destructive or admin tools are registered.
- Rate limiting is enabled by default.
- Inputs are validated with Zod.
- Errors are sanitized and never include stack traces.
- Logs include tool name, duration and status, but not full payloads or secrets.
- The server only calls `ATLARIUM_API_BASE_URL`, which must point to the public
  read-only Atlarium API.

## Local Test Examples

Health:

```bash
curl http://localhost:43118/health
```

Manual JSON-RPC initialize:

```bash
curl -s http://localhost:43118/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"0.0.1"}}}'
```

Conformance:

```bash
pnpm mcp:conformance
```

## Adding Tools

1. Add input schema in `src/schemas.ts`.
2. Add API client method in `src/atlarium-api.ts`.
3. Add read-only tool definition in `src/tools.ts`.
4. Add unit tests for schema, API path mapping and read-only registration.
5. Update this document and `.example` registry files when the public surface changes.

## Not Supported

- Workspace aquarium operations.
- User, auth, admin, journal, schedule or measurement data.
- Write or destructive tools.
- Registry submission or publication automation.

## Before Registry Publication

- Confirm production endpoint and DNS/TLS.
- Confirm license and ownership metadata.
- Run MCP conformance against production.
- Review rate limits and abuse monitoring.
- Validate all public URLs and examples.
- Decide support/contact policy.
