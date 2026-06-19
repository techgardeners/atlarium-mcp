# Security Policy

## Supported Version

The production public endpoint runs the latest `1.x` release from this
repository.

## Reporting A Vulnerability

Do not open public issues for sensitive security reports.

Report vulnerabilities to TechGardeners through the contact listed on
https://atlarium.bio.

Please include:

- affected endpoint or tool
- reproduction steps
- expected impact
- whether private data, write operations or authentication boundaries appear to
  be involved

## Security Boundary

Atlarium Habitat Database MCP is public and read-only. It must not expose:

- user accounts
- private workspaces
- authentication flows
- admin APIs
- journals, schedules or measurements
- write or destructive tools
- plaintext secrets

Inputs are validated before upstream calls, errors are sanitized, and production
traffic is expected to terminate TLS before reaching the Node process.
