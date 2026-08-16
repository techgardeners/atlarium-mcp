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

function jpegDimensions(path: string) {
  const data = readFileSync(join(process.cwd(), path));
  expect(data.subarray(0, 3).toString("hex"), path).toBe("ffd8ff");

  let offset = 2;
  while (offset + 9 < data.length) {
    if (data[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = data[offset + 1]!;
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const length = data.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return {
        height: data.readUInt16BE(offset + 5),
        width: data.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  throw new Error(`JPEG dimensions not found: ${path}`);
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
    expect(pathExists("plugin.json")).toBe(true);
    expect(pathExists(".cursor-plugin/plugin.json")).toBe(true);
    expect(pathExists("mcp.json")).toBe(true);
    expect(pathExists("llms-install.md")).toBe(true);
    expect(pathExists("config/distribution-registry.json")).toBe(true);
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
    expect((pkg.scripts as Record<string, string>)["mcp:report:usage"]).toBe(
      "node scripts/report-mcp-usage.mjs",
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

  it("keeps real ChatGPT host evidence separate from widget fixtures", () => {
    const evidence = [
      [
        "docs/assets/chatgpt-screenshots/real-host/search-fish-web.jpg",
        { width: 727, height: 1265 },
      ],
      [
        "docs/assets/chatgpt-screenshots/real-host/fish-profile-web.jpg",
        { width: 727, height: 1265 },
      ],
      [
        "docs/assets/chatgpt-screenshots/real-host/fish-profile-mobile-390x844.jpg",
        { width: 390, height: 844 },
      ],
    ] as const;

    expect(
      pathExists("docs/assets/chatgpt-screenshots/real-host/README.md"),
    ).toBe(true);
    for (const [path, dimensions] of evidence) {
      expect(pathExists(path), path).toBe(true);
      expect(jpegDimensions(path), path).toEqual(dimensions);
    }

    const manifest = readFileSync(
      join(
        process.cwd(),
        "docs/assets/chatgpt-screenshots/real-host/README.md",
      ),
      "utf8",
    );
    expect(manifest).toMatch(/not evidence\s+of native iOS or Android/);
    expect(readFileSync("docs/widget-visual-review.md", "utf8")).toContain(
      "real-host/search-fish-web.jpg",
    );
  });
});
