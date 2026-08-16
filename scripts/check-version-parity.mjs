#!/usr/bin/env node
import { readFileSync } from "node:fs";

const packageJson = readJson("package.json");
const expected = packageJson.version;
const checks = [
  ["server.json", readJson("server.json").version],
  ["plugin.json", readJson("plugin.json").version],
  [".cursor-plugin/plugin.json", readJson(".cursor-plugin/plugin.json").version],
  ["src/config.ts", capture("src/config.ts", /MCP_VERSION:[\s\S]*?\.default\("([^"]+)"\)/)],
  ["deploy/kubernetes/configmap.yaml", capture("deploy/kubernetes/configmap.yaml", /MCP_VERSION:\s*([^\s]+)/)],
  ["deploy/kubernetes/deployment.yaml", capture("deploy/kubernetes/deployment.yaml", /atlarium-mcp:([^\s]+)/)],
  ["deploy/kubernetes/kustomization.yaml", capture("deploy/kubernetes/kustomization.yaml", /newTag:\s*([^\s]+)/)],
];

for (const [source, actual] of checks) {
  if (actual !== expected) {
    throw new Error(`Version mismatch in ${source}: expected ${expected}, found ${actual ?? "missing"}`);
  }
}

const widgetSource = readFileSync("src/apps/habitat-explorer.ts", "utf8");
if (!widgetSource.includes('habitatExplorerResourceUri = "ui://widget/habitat-explorer.v4.html"')) {
  throw new Error("Current widget URI is not Habitat Explorer v4.");
}

console.log(JSON.stringify({ version: expected, widget: "v4", sources: checks.length + 1 }));

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function capture(path, pattern) {
  return readFileSync(path, "utf8").match(pattern)?.[1];
}
