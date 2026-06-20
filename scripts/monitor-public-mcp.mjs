#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const endpoint = process.env.MCP_MONITOR_PUBLIC_URL ?? "https://mcp.atlarium.bio/mcp";
const healthUrl = process.env.MCP_MONITOR_HEALTH_URL ?? "https://mcp.atlarium.bio/health";
const serverCardUrl =
  process.env.MCP_MONITOR_SERVER_CARD_URL ??
  "https://mcp.atlarium.bio/.well-known/mcp/server-card.json";
const docsUrl = process.env.MCP_MONITOR_DOCS_URL ?? "https://atlarium.bio/mcp";
const timeoutMs = Number(process.env.MCP_MONITOR_TIMEOUT_MS ?? 15_000);

const expectedTools = [
  "search_fish",
  "get_fish_profile",
  "search_plants",
  "get_plant_profile",
  "search_products",
  "get_product_profile",
  "check_species_compatibility",
  "get_water_parameters",
  "suggest_species_for_tank",
  "search_guides",
  "get_guide",
  "search_algae",
  "get_algae_profile",
  "search_diseases",
  "get_disease_profile",
  "search_plant_problems",
  "get_plant_problem_profile",
  "search_medicines",
  "get_medicine_profile",
  "match_diagnostic_profiles",
  "list_product_categories",
  "list_product_brands",
  "search_equipment",
  "get_equipment_profile",
  "search_fertilizers",
  "get_fertilizer_profile",
  "search_fertilization_regimes",
  "get_fertilization_regime",
  "calculate_fertilizer_dose",
  "calculate_nutrient_gaps",
  "calculate_weekly_dose_totals",
  "generate_fertilization_plan",
  "calculate_tank_volume",
  "calculate_tank_weight",
  "calculate_water_change",
  "calculate_water_chemistry",
  "convert_units",
  "calculate_equipment_requirements",
  "suggest_habitat_for_tank",
];
const expectedResourceUri = "ui://widget/habitat-explorer.v3.html";
const expectedResourceMimeType = "text/html;profile=mcp-app";
const expectedPrompts = [
  "atlarium_species_search",
  "atlarium_compatibility_check",
  "atlarium_habitat_plan",
  "atlarium_algae_diagnosis",
  "atlarium_disease_diagnosis",
  "atlarium_plant_problem_diagnosis",
  "atlarium_product_selection",
  "atlarium_fertilization_plan",
  "atlarium_tank_calculations",
];

const forbiddenToolPattern =
  /(workspace|auth|admin|user|write|delete|create|update|secret|token)/i;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertToolSurface(toolNames) {
  const missing = expectedTools.filter((name) => !toolNames.includes(name));
  const extra = toolNames.filter((name) => !expectedTools.includes(name));
  const forbidden = toolNames.filter((name) => forbiddenToolPattern.test(name));

  assert(missing.length === 0, `missing tools: ${missing.join(", ")}`);
  assert(extra.length === 0, `unexpected tools: ${extra.join(", ")}`);
  assert(forbidden.length === 0, `forbidden tools: ${forbidden.join(", ")}`);
}

async function fetchWithTimeout(url, init = {}) {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  });
}

async function checkHttpStatus(label, url, expectedStatus) {
  const response = await fetchWithTimeout(url);
  assert(
    response.status === expectedStatus,
    `${label} returned HTTP ${response.status}, expected ${expectedStatus}`,
  );
  return `HTTP ${response.status}`;
}

async function readJson(label, url) {
  const response = await fetchWithTimeout(url);
  assert(response.status === 200, `${label} returned HTTP ${response.status}`);
  return response.json();
}

async function checkHealth() {
  const health = await readJson("health", healthUrl);
  assert(health.status === "ok", `health.status is ${JSON.stringify(health.status)}`);
  assert(
    health.service === "Atlarium Habitat Database MCP",
    `health.service is ${JSON.stringify(health.service)}`,
  );
  return `${health.service} ${health.version ?? "unknown-version"}`;
}

async function checkServerCard() {
  const card = await readJson("server-card", serverCardUrl);
  assert(card.auth?.type === "none", `server-card auth.type is ${card.auth?.type}`);
  assert(
    card.transport?.type === "streamable-http",
    `server-card transport.type is ${card.transport?.type}`,
  );
  assert(card.transport?.url === endpoint, `server-card transport.url is ${card.transport?.url}`);
  assert(card.readOnly === true, "server-card readOnly is not true");
  assert(card.capabilities?.tools === true, "server-card capabilities.tools is not true");
  assert(
    card.capabilities?.resources === true,
    "server-card capabilities.resources is not true",
  );
  assert(card.capabilities?.prompts === true, "server-card capabilities.prompts is not true");
  assert(Array.isArray(card.tools), "server-card tools is not an array");
  assert(Array.isArray(card.resources), "server-card resources is not an array");
  assert(Array.isArray(card.prompts), "server-card prompts is not an array");

  const toolNames = card.tools.map((tool) => tool.name);
  assertToolSurface(toolNames);
  const nonReadOnlyTools = card.tools
    .filter((tool) => tool.readOnly !== true)
    .map((tool) => tool.name);
  assert(
    nonReadOnlyTools.length === 0,
    `server-card non-read-only tools: ${nonReadOnlyTools.join(", ")}`,
  );

  const widget = card.resources.find((resource) => resource.uri === expectedResourceUri);
  assert(widget, `server-card missing ${expectedResourceUri}`);
  assert(
    widget.mimeType === expectedResourceMimeType,
    `widget mime type is ${widget.mimeType}`,
  );

  const promptNames = card.prompts.map((prompt) => prompt.name);
  const missingPrompts = expectedPrompts.filter((name) => !promptNames.includes(name));
  assert(missingPrompts.length === 0, `server-card missing prompts: ${missingPrompts.join(", ")}`);

  return `${toolNames.length} read-only tools, ${promptNames.length} prompts, widget resource advertised`;
}

async function checkMcpSession() {
  const client = new Client({
    name: "atlarium-public-monitor",
    version: "1.0.0",
  });
  const transport = new StreamableHTTPClientTransport(new URL(endpoint));

  try {
    await client.connect(transport);
    const resourcesResult = await client.listResources();
    const widget = resourcesResult.resources.find(
      (resource) => resource.uri === expectedResourceUri,
    );
    assert(widget, `resources/list missing ${expectedResourceUri}`);
    assert(
      widget.mimeType === expectedResourceMimeType,
      `resources/list widget mime type is ${widget.mimeType}`,
    );
    const widgetResult = await client.readResource({ uri: expectedResourceUri });
    const html = widgetResult.contents.find(
      (content) => content.mimeType === expectedResourceMimeType && "text" in content,
    );
    assert(html, "resources/read did not return widget HTML");
    assert(
      html.text.includes("Atlarium Habitat Explorer"),
      "widget HTML missing app title",
    );

    const toolsResult = await client.listTools();
    const toolNames = toolsResult.tools.map((tool) => tool.name);
    assertToolSurface(toolNames);
    const promptsResult = await client.listPrompts();
    const promptNames = promptsResult.prompts.map((prompt) => prompt.name);
    const missingPrompts = expectedPrompts.filter((name) => !promptNames.includes(name));
    assert(missingPrompts.length === 0, `prompts/list missing ${missingPrompts.join(", ")}`);
    return `${toolNames.length} tools, ${promptNames.length} prompts and widget resource from JSON-RPC`;
  } finally {
    await client.close();
  }
}

async function step(label, check) {
  const startedAt = performance.now();
  try {
    const detail = await check();
    const durationMs = Math.round(performance.now() - startedAt);
    console.log(`ok ${label}: ${detail} (${durationMs}ms)`);
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`fail ${label}: ${message}`);
    return `${label}: ${message}`;
  }
}

const failures = (
  await Promise.all([
    step("docs", () => checkHttpStatus("docs", docsUrl, 200)),
    step("health", checkHealth),
    step("server-card", checkServerCard),
    step("mcp-get", () => checkHttpStatus("mcp-get", endpoint, 405)),
    step("mcp-json-rpc", checkMcpSession),
  ])
).filter(Boolean);

if (failures.length > 0) {
  console.error(`public MCP monitor failed: ${failures.join("; ")}`);
  process.exit(1);
}

console.log("public MCP monitor passed");
