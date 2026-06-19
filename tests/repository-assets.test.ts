import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function pathExists(path: string) {
  return existsSync(join(process.cwd(), path));
}

function readJson(path: string) {
  return JSON.parse(readFileSync(join(process.cwd(), path), "utf8")) as Record<
    string,
    unknown
  >;
}

describe("repository publication assets", () => {
  it("publishes installability and governance files", () => {
    expect(pathExists("LICENSE")).toBe(true);
    expect(pathExists("CONTRIBUTING.md")).toBe(true);
    expect(pathExists("SECURITY.md")).toBe(true);
    expect(pathExists(".github/ISSUE_TEMPLATE/bug_report.md")).toBe(true);
    expect(pathExists(".github/workflows/public-mcp-monitor.yml")).toBe(true);
    expect(pathExists(".github/workflows/mcp-directory-audit.yml")).toBe(true);
    expect(pathExists("scripts/monitor-public-mcp.mjs")).toBe(true);
  });

  it("keeps package metadata suitable for public discovery", () => {
    const pkg = readJson("package.json");

    expect(pkg).toMatchObject({
      bugs: {
        url: "https://github.com/techgardeners/atlarium-mcp/issues",
      },
      homepage: "https://atlarium.bio/mcp",
      license: "MIT",
      repository: {
        type: "git",
        url: "git+https://github.com/techgardeners/atlarium-mcp.git",
      },
    });
    expect(pkg.keywords).toEqual(
      expect.arrayContaining([
        "mcp",
        "model-context-protocol",
        "streamable-http",
        "aquarium",
        "habitat-data",
      ]),
    );
    expect((pkg.scripts as Record<string, string>)["mcp:monitor:public"]).toBe(
      "node scripts/monitor-public-mcp.mjs",
    );
  });

  it("includes client-specific examples", () => {
    for (const path of [
      "examples/openai-agents-python/agent.py",
      "examples/claude-code/README.md",
      "examples/cursor/mcp.json",
      "examples/windsurf/mcp_config.json",
      "examples/vscode/mcp.json",
      "examples/antigravity/mcp.json",
      "examples/chatgpt-apps/README.md",
      "examples/generic-streamable-http/README.md",
    ]) {
      expect(pathExists(path), path).toBe(true);
    }
  });
});
