import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function runReport(entries: unknown[]) {
  const directory = mkdtempSync(join(tmpdir(), "atlarium-mcp-usage-"));
  const logPath = join(directory, "mcp.log");
  writeFileSync(
    logPath,
    `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`,
  );

  try {
    return spawnSync(
      process.execPath,
      [
        "scripts/report-mcp-usage.mjs",
        `--file=${logPath}`,
        "--since=24h",
        "--strict",
      ],
      { encoding: "utf8" },
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

describe("MCP usage report", () => {
  it("separates external traffic and probes while accepting canonical errors", () => {
    const result = runReport([
      { event: "mcp_request", method: "tools/list", result: "ok" },
      {
        event: "mcp_request",
        method: "tools/list",
        probe: "public-monitor",
        result: "ok",
      },
      {
        event: "mcp_tool_call",
        tool: "search_fish",
        result: "ok",
      },
      {
        event: "mcp_tool_call",
        tool: "get_fish_profile",
        probe: "public-monitor",
        result: "error",
        error_code: "not_found",
      },
      { event: "unrelated", args: { ignored: true } },
    ]);

    expect(result.status).toBe(0);
    const report = JSON.parse(result.stdout) as {
      requests: Record<string, number>;
      tool_calls: Record<string, number>;
      errors: Record<string, number>;
      probes: Record<string, number>;
      privacy: Record<string, number>;
    };
    expect(report.requests).toMatchObject({
      total: 2,
      external: 1,
      synthetic: 1,
      unclassified: 0,
      error: 0,
    });
    expect(report.tool_calls).toMatchObject({
      total: 2,
      external: 1,
      synthetic: 1,
      unclassified: 0,
      error: 1,
    });
    expect(report.errors).toEqual({ not_found: 1 });
    expect(report.probes).toEqual({ "public-monitor": 2 });
    expect(report.privacy).toEqual({
      forbidden_fields: 0,
      invalid_error_codes: 0,
    });
  });

  it("fails strict mode for client content or unknown error codes", () => {
    const result = runReport([
      {
        event: "mcp_tool_call",
        tool: "get_fish_profile",
        result: "error",
        error_code: "unexpected_failure",
        args: { slug: "must-not-be-logged" },
      },
    ]);

    expect(result.status).toBe(1);
    const report = JSON.parse(result.stdout) as {
      privacy: Record<string, number>;
    };
    expect(report.privacy).toEqual({
      forbidden_fields: 1,
      invalid_error_codes: 1,
    });
  });
});
