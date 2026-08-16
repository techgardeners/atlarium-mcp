#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const argv = process.argv.slice(2).filter((argument) => argument !== "--");
const since = valueFor("--since") ?? "720h";
const file = valueFor("--file");
const production = argv.includes("--production");
const strict = argv.includes("--strict");
const ALLOWED_ERROR_CODES = new Set([
  "not_found",
  "invalid_slug",
  "validation_error",
  "internal_error",
]);
const FORBIDDEN_CLIENT_FIELDS = new Set([
  "args",
  "arguments",
  "error",
  "ip",
  "message",
  "prompt",
  "user-agent",
  "user_agent",
]);

if (argv.includes("--help")) {
  console.log("Usage: pnpm mcp:report:usage -- [--production | --file=PATH] [--since=720h] [--strict]");
  process.exit(0);
}

if (!/^\d+[smhd]$/.test(since)) {
  throw new Error("--since must use a bounded kubectl duration such as 30m, 24h or 720h.");
}
if (production === Boolean(file)) {
  throw new Error("Choose exactly one log source: --production or --file=PATH.");
}

const logText = production ? readProductionLogs(since) : readFileSync(file, "utf8");
const report = summarize(logText, since);
console.log(JSON.stringify(report, null, 2));
if (strict && (report.privacy.forbidden_fields > 0 || report.privacy.invalid_error_codes > 0)) {
  process.exitCode = 1;
}

function valueFor(name) {
  const inline = argv.find((argument) => argument.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
}

function readProductionLogs(duration) {
  const host = process.env.MCP_REPORT_SSH_HOST ?? "spartaco";
  const namespace = process.env.MCP_REPORT_NAMESPACE ?? "atlarium-mcp";
  const result = spawnSync(
    "ssh",
    [
      host,
      "kubectl",
      "logs",
      "-n",
      namespace,
      "-l",
      "app.kubernetes.io/name=atlarium-mcp",
      "--all-containers=true",
      `--since=${duration}`,
      "--tail=-1",
    ],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  if (result.status !== 0) {
    const detail = result.stderr.trim() || `ssh exited with status ${result.status}`;
    throw new Error(`Unable to read production MCP logs through ${host}: ${detail}`);
  }
  return result.stdout;
}

function summarize(text, duration) {
  const entries = text
    .split(/\r?\n/)
    .map(parseLogLine)
    .filter(Boolean)
    .filter((entry) => entry.event === "mcp_request" || entry.event === "mcp_tool_call");
  const requests = entries.filter((entry) => entry.event === "mcp_request");
  const calls = entries.filter((entry) => entry.event === "mcp_tool_call");

  return {
    generated_at: new Date().toISOString(),
    since: duration,
    requests: countTraffic(requests),
    tool_calls: countTraffic(calls),
    tools: countBy(calls, "tool"),
    errors: countErrors(entries),
    probes: countBy(entries.filter((entry) => entry.probe), "probe"),
    privacy: privacySummary(entries),
  };
}

function privacySummary(entries) {
  const forbiddenFields = entries.reduce(
    (total, entry) =>
      total + Object.keys(entry).filter((key) => FORBIDDEN_CLIENT_FIELDS.has(key)).length,
    0,
  );
  const invalidErrorCodes = entries.filter(
    (entry) =>
      (entry.result ?? entry.status) === "error" &&
      typeof entry.error_code === "string" &&
      !ALLOWED_ERROR_CODES.has(entry.error_code),
  ).length;

  return {
    forbidden_fields: forbiddenFields,
    invalid_error_codes: invalidErrorCodes,
  };
}

function parseLogLine(line) {
  const jsonStart = line.indexOf("{");
  if (jsonStart < 0) return null;
  try {
    const value = JSON.parse(line.slice(jsonStart));
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

function countTraffic(entries) {
  const modernEntries = entries.filter((entry) => typeof entry.result === "string");
  return {
    total: entries.length,
    external: modernEntries.filter((entry) => !entry.probe).length,
    synthetic: entries.filter((entry) => entry.probe).length,
    unclassified: entries.filter(
      (entry) => typeof entry.result !== "string" && !entry.probe,
    ).length,
    ok: entries.filter((entry) => (entry.result ?? entry.status) === "ok").length,
    error: entries.filter((entry) => (entry.result ?? entry.status) === "error").length,
  };
}

function countErrors(entries) {
  return countBy(
    entries
      .filter((entry) => (entry.result ?? entry.status) === "error")
      .map((entry) => ({
        error_code:
          typeof entry.error_code === "string"
            ? entry.error_code
            : legacyErrorCode(entry),
      })),
    "error_code",
  );
}

function legacyErrorCode(entry) {
  const text = typeof entry.error === "string" ? entry.error : "";
  if (/invalid[_ -]?slug|slug[^\n]{0,40}invalid/i.test(text)) {
    return "invalid_slug";
  }
  if (/not[_ -]?found|\b404\b/i.test(text)) {
    return "not_found";
  }
  if (/validation|invalid[_ -]?(input|argument)|required/i.test(text)) {
    return "validation_error";
  }
  return "internal_error";
}

function countBy(entries, field) {
  return Object.fromEntries(
    [...entries.reduce((counts, entry) => {
      const key = typeof entry[field] === "string" ? entry[field] : "unknown";
      counts.set(key, (counts.get(key) ?? 0) + 1);
      return counts;
    }, new Map())].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0])),
  );
}
