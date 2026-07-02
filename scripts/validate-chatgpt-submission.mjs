#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const endpoint = process.env.MCP_SUBMISSION_VALIDATE_URL ?? "https://mcp.atlarium.bio/mcp";
const submissionPath =
  process.env.CHATGPT_APP_SUBMISSION_JSON ?? "chatgpt-app-submission.json";

const submission = JSON.parse(readFileSync(submissionPath, "utf8"));

const expectedCases = [
  {
    assert(data) {
      const first = data?.results?.[0];
      assertEqual(first?.slug, "paracheirodon-innesi", "top fish slug");
      assertEqual(first?.common_name, "Neon Tetra", "top fish common name");
    },
    args: { query: "neon tetra", language: "en", limit: 1 },
    description: "Search fish records with an exact common-name query.",
    tool: "search_fish",
  },
  {
    assert(data) {
      assertEqual(
        data?.compatibility_level,
        "compatible_with_caution",
        "compatibility level",
      );
      const slugs = data?.species_profiles?.map((profile) => profile.slug) ?? [];
      assertIncludes(slugs, "corydoras-paleatus", "compatibility species profiles");
      assertIncludes(slugs, "betta-splendens", "compatibility species profiles");
    },
    args: {
      species: ["Corydoras paleatus", "Betta splendens"],
      language: "en",
      tank_liters: 90,
      ph: 6.8,
      temperature: 24,
    },
    description: "Check a community species pair for compatibility.",
    tool: "check_species_compatibility",
  },
  {
    assert(data) {
      assertTrue(
        Array.isArray(data?.suggestions) && data.suggestions.length > 0,
        "species suggestions are returned",
      );
      assertTrue(
        data.suggestions.every((suggestion) => suggestion.public_url),
        "species suggestions include public URLs",
      );
    },
    args: {
      tank_liters: 90,
      language: "en",
      ph: 6.8,
      temperature: 24,
      beginner_friendly: true,
      planted_tank: true,
      limit: 3,
    },
    description: "Suggest peaceful species for a planted freshwater tank.",
    tool: "suggest_species_for_tank",
  },
  {
    assert(data) {
      const first = data?.results?.[0];
      assertEqual(first?.slug, "water-parameters/no3", "top guide slug");
      assertEqual(first?.title, "Nitrate", "top guide title");
    },
    args: { query: "nitrate", language: "en", limit: 1 },
    description: "Search guide records with an exact nutrient query.",
    tool: "search_guides",
  },
  {
    assert(data) {
      assertNear(data?.result?.grossLiters, 64.8, "gross liters");
      assertNear(data?.result?.netLiters, 64.8, "net liters");
      assertNear(data?.result?.waterWeightKg, 64.8, "water weight kg");
    },
    args: { shape: "rect", length_cm: 60, width_cm: 30, height_cm: 36 },
    description: "Calculate a deterministic rectangular tank volume.",
    tool: "calculate_tank_volume",
  },
];

function assertSubmissionShape() {
  assertEqual(
    submission.test_cases?.length,
    5,
    "submission must include exactly five positive test cases",
  );
  assertEqual(
    submission.negative_test_cases?.length,
    3,
    "submission must include exactly three negative test cases",
  );

  const toolNames = new Set(Object.keys(submission.tools ?? {}));
  for (const testCase of submission.test_cases) {
    const expected = expectedCases.find(
      (candidate) => candidate.description === testCase.description,
    );
    assertTrue(Boolean(expected), `unexpected positive test case: ${testCase.description}`);
    assertEqual(testCase.tools_triggered, expected.tool, `${testCase.description} tool`);
    assertTrue(toolNames.has(testCase.tools_triggered), `${testCase.tools_triggered} is declared`);
  }

  for (const testCase of submission.negative_test_cases) {
    assertEqual(testCase.tools_triggered, null, `${testCase.description} tools_triggered`);
  }
}

function assertToolMetadata(tools) {
  const submittedTools = Object.entries(submission.tools ?? {});
  assertEqual(tools.length, submittedTools.length, "live tool count matches submission");
  const liveToolNames = new Set(tools.map((tool) => tool.name));

  for (const [name, submitted] of submittedTools) {
    assertTrue(liveToolNames.has(name), `live tools include ${name}`);
    assertEqual(
      submitted.annotations?.readOnlyHint,
      true,
      `${name} readOnlyHint in submission`,
    );
    assertEqual(
      submitted.annotations?.openWorldHint,
      false,
      `${name} openWorldHint in submission`,
    );
    assertEqual(
      submitted.annotations?.destructiveHint,
      false,
      `${name} destructiveHint in submission`,
    );
  }
}

async function validateToolCalls(client) {
  for (const testCase of expectedCases) {
    const result = await client.callTool(
      {
        name: testCase.tool,
        arguments: testCase.args,
      },
      undefined,
      { timeout: 30_000 },
    );
    assertTrue(!result.isError, `${testCase.tool} returned success`);
    testCase.assert(extractData(result));
    console.log(`ok ${testCase.tool}: ${testCase.description}`);
  }
}

function extractData(result) {
  if (result.structuredContent?.data !== undefined) {
    return result.structuredContent.data;
  }

  const text = result.content?.find((item) => item.type === "text")?.text;
  assertTrue(Boolean(text), "tool returned text content");
  return JSON.parse(text);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertIncludes(values, expected, label) {
  if (!values.includes(expected)) {
    throw new Error(`${label}: expected ${JSON.stringify(values)} to include ${expected}`);
  }
}

function assertNear(actual, expected, label) {
  if (typeof actual !== "number" || Math.abs(actual - expected) > 0.05) {
    throw new Error(`${label}: expected ${expected}, got ${JSON.stringify(actual)}`);
  }
}

function assertTrue(condition, label) {
  if (!condition) {
    throw new Error(label);
  }
}

assertSubmissionShape();

const client = new Client({
  name: "atlarium-chatgpt-submission-validator",
  version: "1.0.0",
});
const transport = new StreamableHTTPClientTransport(new URL(endpoint));

try {
  await client.connect(transport);
  const tools = await client.listTools();
  assertToolMetadata(tools.tools);
  await validateToolCalls(client);
  console.log(`chatgpt app submission validation passed for ${endpoint}`);
} finally {
  await client.close();
}
