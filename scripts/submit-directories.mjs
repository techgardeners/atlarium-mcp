#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = new Set(process.argv.slice(2).filter((arg) => arg !== "--"));
const outDir = "tmp/directory-submissions";
const generatedAt = new Date().toISOString();

const serverJson = JSON.parse(readFileSync("server.json", "utf8"));
const name = "Atlarium Habitat Database MCP";
const shortDescription =
  "Structured aquarium, marine, terrarium and paludarium data and public advisory functions for AI agents.";
const longDescription =
  "Atlarium MCP is a public read-only MCP server that gives AI agents structured access to data and advisory functions for aquariums, marine tanks, coldwater systems, terrariums, paludariums and vivariums. It includes animals, plants, products, guides, algae, diseases, plant problems, medicines, compatibility, fertilization, habitat planning and public aquarium calculators.";
const endpoint = serverJson.remotes?.[0]?.url ?? "https://mcp.atlarium.bio/mcp";
const repository = serverJson.repository?.url ?? "https://github.com/techgardeners/atlarium-mcp";
const docs = "https://atlarium.bio/mcp";
const serverCard = "https://mcp.atlarium.bio/.well-known/mcp/server-card.json";
const health = "https://mcp.atlarium.bio/health";
const registryName = serverJson.name;
const registryUrl = `https://registry.modelcontextprotocol.io/v0.1/servers?search=${encodeURIComponent(registryName)}`;

const connectionBlock = [
  `Transport: Streamable HTTP`,
  `Endpoint: ${endpoint}`,
  `Auth: none`,
  `Server card: ${serverCard}`,
  `Docs: ${docs}`,
  `Repository: ${repository}`,
  `Official MCP Registry: ${registryName}`,
].join("\n");

const safetyStatement =
  "Atlarium Habitat Database MCP is read-only. It does not expose user accounts, workspaces, admin APIs, private data or write operations.";
const surfaceStatement =
  "Surface: 39 public read-only tools for catalog data, diagnostics, products, fertilization, calculators, compatibility and habitat planning.";

const markdownPayload = `# ${name}

${shortDescription}

${longDescription}

## Connection

${connectionBlock}

## Safety

${safetyStatement}

## Suggested Categories

- Aquariums
- Marine
- Terrariums
- Animals
- Plants
- Habitat planning
- Diagnostics
- Fertilization
- Calculators
- Research and data

## Tool Surface

${surfaceStatement}

Generated: ${generatedAt}
`;

const mcpSoComment = `${markdownPayload}

MCP.so submission note:

This is a public remote MCP server. It is already published in the Official MCP Registry as \`${registryName}\`.
`;

const pulseEmail = `To: hello@pulsemcp.com
Subject: Atlarium Habitat Database MCP listing / registry sync

Hello PulseMCP team,

Could you please confirm that the following public remote MCP server is queued for PulseMCP indexing?

${markdownPayload}

Thank you.
`;

const secondaryDirectoryPayloads = `# Secondary Directory Payloads

Generated: ${generatedAt}

Use this file for manual form submissions that require login, OAuth, owner
verification or a final maintainer click. Do not add a badge until a public
listing is visible.

## Smithery

Listing URL: https://smithery.ai/servers/ilgrafico79/atlarium-habitat-database
Status: published / visible

Name: ${name}
Repository: ${repository}
Remote endpoint: ${endpoint}
Transport: Streamable HTTP
Authentication: none
Server card: ${serverCard}
Docs: ${docs}
Description: ${shortDescription}
${surfaceStatement}
Safety: ${safetyStatement}
Quality score: 96/100 after parameter descriptions and custom icon upload.
The remaining score gap is the non-breaking Smithery naming heuristic.

## Glama

Connector URL: https://glama.ai/mcp/connectors/${registryName}
Claim file: https://mcp.atlarium.bio/.well-known/glama.json

Use the live claim file to complete the ownership flow if Glama asks for manual
confirmation.

## MCP.so

Existing submission evidence:
https://github.com/chatmcp/mcpso/issues/1#issuecomment-4722425013

Follow-up:

${mcpSoComment}

## MCP Scoreboard

Listing URL:
https://www.mcpscoreboard.com/server/8fb9547d-bdb4-4fab-8218-ef13c1be32fc/

Request owner verification or scoring only from a TechGardeners GitHub account.
Do not publish a score badge while the listing is unscored.

## mcpservers.org

Submission/search URL: https://mcpservers.org/search

Use ${repository} as the project URL and ${endpoint} as the remote Streamable
HTTP endpoint.

## MCPRepository

Submission URL: https://mcprepository.com/submit

Use the canonical metadata block plus the GitHub repository URL.

## MCP Server Hub

Submission URL: https://mcpserverhub.com/submit

Use the canonical metadata block, server card URL and contact
info@techgardeners.com.

## MCP Market / Marketplace

Submission URLs:
- https://mcpmarket.com/submit
- https://mcp-marketplace.io/submit

These flows may require login or can hit anti-bot checkpoints. Submit manually
from a logged-in browser and keep status pending until the public listing is
visible.
`;

const formPayload = {
  type: "MCP Server",
  name,
  url: repository,
  description: shortDescription,
  longDescription,
  endpoint,
  transport: "streamable-http",
  authentication: "none",
  serverCard,
  docs,
  registryName,
  safety: safetyStatement,
  surface: surfaceStatement,
  serverConfig: {
    mcpServers: {
      "atlarium-habitat-database": {
        type: "streamable-http",
        url: endpoint,
      },
    },
  },
};

function run(command, commandArgs, options = {}) {
  const output = execFileSync(command, commandArgs, {
    encoding: "utf8",
    stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
  });
  return typeof output === "string" ? output.trim() : "";
}

async function checkUrl(label, url, expectedStatuses = [200]) {
  const response = await fetch(url, { redirect: "manual" });
  console.log(`${label}: HTTP ${response.status}`);
  if (!expectedStatuses.includes(response.status)) {
    process.exitCode = 1;
  }
  return response;
}

async function check() {
  await checkUrl("docs", docs);
  await checkUrl("health", health);
  await checkUrl("server-card", serverCard);
  await checkUrl("mcp-get-expected-405", endpoint, [405]);

  const registryResponse = await fetch(registryUrl);
  if (!registryResponse.ok) {
    console.log(`official-registry: HTTP ${registryResponse.status}`);
    process.exitCode = 1;
    return;
  }
  const registry = await registryResponse.json();
  const names = (registry.servers ?? [])
    .map((entry) => entry.server?.name ?? entry.name)
    .filter(Boolean);
  const found = names.includes(registryName);
  console.log(`official-registry: ${found ? "found" : "not-found"}`);
  if (!found) {
    process.exitCode = 1;
  }
}

function writeArtifacts() {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "directory-submission.md"), markdownPayload);
  writeFileSync(join(outDir, "mcp-so-comment.md"), mcpSoComment);
  writeFileSync(join(outDir, "pulsemcp-email.md"), pulseEmail);
  writeFileSync(join(outDir, "mcp-so-form.json"), `${JSON.stringify(formPayload, null, 2)}\n`);
  writeFileSync(join(outDir, "secondary-directory-payloads.md"), secondaryDirectoryPayloads);
  console.log(`Wrote submission artifacts to ${outDir}`);
}

function openPages() {
  const pages = [
    "https://smithery.ai/new",
    "https://glama.ai/mcp/servers",
    "https://www.pulsemcp.com/submit",
    "https://mcp.so/submit",
    "https://github.com/chatmcp/mcpso/issues/1",
  ];

  for (const page of pages) {
    spawnSync("open", [page], { stdio: "ignore" });
  }
  console.log("Opened directory submission pages.");
}

function getExistingMcpSoSubmissionUrl() {
  const total = Number(
    run("gh", [
      "api",
      "-X",
      "GET",
      "search/issues",
      "-f",
      `q=repo:chatmcp/mcpso "${name}"`,
      "--jq",
      ".total_count",
    ]),
  );

  if (total > 0) {
    return "https://github.com/chatmcp/mcpso/issues/1";
  }

  const matchingCommentUrls = run("gh", [
    "api",
    "-X",
    "GET",
    "--paginate",
    "repos/chatmcp/mcpso/issues/1/comments",
    "-f",
    "per_page=100",
    "--jq",
    `.[] | select(.body | contains("${name}")) | .html_url`,
  ]);

  return matchingCommentUrls.split("\n").find(Boolean);
}

function submitMcpSo() {
  if (!args.has("--yes")) {
    throw new Error("Refusing to post publicly without --yes.");
  }

  writeArtifacts();

  const existingSubmissionUrl = getExistingMcpSoSubmissionUrl();
  if (existingSubmissionUrl) {
    console.log(
      `MCP.so GitHub issue already mentions ${name}; skipping duplicate comment: ${existingSubmissionUrl}`,
    );
    return;
  }

  run(
    "gh",
    [
      "issue",
      "comment",
      "1",
      "--repo",
      "chatmcp/mcpso",
      "--body-file",
      join(outDir, "mcp-so-comment.md"),
    ],
    { stdio: "inherit" },
  );
  console.log("Posted MCP.so submission comment to chatmcp/mcpso#1.");
}

function printHelp() {
  console.log(`Usage: pnpm directories:submit -- [options]

Options:
  --check          Check public URLs and Official MCP Registry presence.
  --payload        Generate reusable submission payload files.
  --open           Open Smithery, Glama, PulseMCP and MCP.so submission pages.
  --submit-mcp-so  Submit to MCP.so through chatmcp/mcpso#1 using gh.
  --yes            Required with --submit-mcp-so because it posts publicly.

Notes:
  Smithery and Glama require maintainer OAuth/claim in their web UI.
  PulseMCP ingests the Official MCP Registry; use the generated email only if
  the server is not listed after their weekly processing window.
`);
}

if (args.size === 0 || args.has("--help")) {
  printHelp();
}

if (args.has("--payload")) {
  writeArtifacts();
}

if (args.has("--check")) {
  await check();
}

if (args.has("--open")) {
  openPages();
}

if (args.has("--submit-mcp-so")) {
  submitMcpSo();
}
