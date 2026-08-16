import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type DistributionTarget = {
  id: string;
  status: string;
  evidence: string;
  verificationStatuses?: number[];
  submission?: {
    submittedAt: string;
    attempt: number;
    evidenceUrl: string | null;
    payload: Record<string, unknown>;
    followUpAt: string[];
  };
};

type DistributionRelease = {
  version: string;
  candidateVersion?: string | null;
};

describe("distribution registry", () => {
  const registry = JSON.parse(
    readFileSync("config/distribution-registry.json", "utf8"),
  ) as {
    schemaVersion: number;
    followUpDays: number[];
    release: DistributionRelease;
    targets: DistributionTarget[];
  };

  it("uses the canonical D7/D14/D30 follow-up policy", () => {
    expect(registry.schemaVersion).toBe(2);
    expect(registry.followUpDays).toEqual([7, 14, 30]);
  });

  it("separates the published release from the unreleased source candidate", () => {
    const server = JSON.parse(readFileSync("server.json", "utf8")) as {
      version: string;
    };
    const registryTarget = registry.targets.find(
      (target) => target.id === "official_registry",
    );
    const mcpFindTarget = registry.targets.find(
      (target) => target.id === "mcp_find",
    );

    expect(registry.release.version).toBe("2.0.1");
    expect(registry.release.candidateVersion).toBe(server.version);
    expect(registryTarget?.evidence).toContain(registry.release.version);
    expect(mcpFindTarget?.submission?.payload.package).toBe(
      `ghcr.io/techgardeners/atlarium-mcp:${registry.release.version}`,
    );
  });

  it("documents every pending submission without contact data", () => {
    for (const target of registry.targets.filter((candidate) =>
      ["submitted", "in_review"].includes(candidate.status),
    )) {
      expect(target.submission, target.id).toBeDefined();
      expect(Date.parse(target.submission!.submittedAt), target.id).not.toBeNaN();
      expect(target.submission!.attempt, target.id).toBeGreaterThanOrEqual(1);
      expect(target.submission!.payload, target.id).not.toEqual({});
      expect(target.submission!.followUpAt, target.id).toHaveLength(3);
      expect(JSON.stringify(target.submission), target.id).not.toMatch(
        /contact|e-?mail/i,
      );
    }
  });

  it("keeps the tested Cline Streamable HTTP install path documented", () => {
    const instructions = readFileSync("llms-install.md", "utf8");

    expect(instructions).toContain(
      "cline mcp install atlarium --transport http https://mcp.atlarium.bio/mcp",
    );
    expect(instructions).toContain('`transportType` as `streamableHttp`');
    expect(instructions).toContain("choose `No auth`");
  });

  it("documents every non-200 directory audit exception", () => {
    for (const target of registry.targets.filter((candidate) =>
      candidate.verificationStatuses?.some((status) => status !== 200),
    )) {
      expect(target.verificationStatuses, target.id).toContain(200);
      expect(target.evidence, target.id).toMatch(
        /automated|github actions|cloudflare|anti-bot|rate-limit/i,
      );
    }
  });

  it("syncs only the published release and accepted public listings", () => {
    const targetRoot = mkdtempSync(join(tmpdir(), "atlarium-mcp-sync-"));
    try {
      mkdirSync(join(targetRoot, "src", "lib"), { recursive: true });
      execFileSync(
        process.execPath,
        ["scripts/submit-directories.mjs", "--sync-page", targetRoot],
        { stdio: "pipe" },
      );
      const generated = readFileSync(
        join(targetRoot, "src", "lib", "mcp-distribution.generated.ts"),
        "utf8",
      );

      expect(generated).toContain('"version": "2.0.1"');
      expect(generated).toContain('"candidateVersion": "2.0.2"');
      expect(generated).not.toContain("MCP Trove");
      expect(generated).not.toContain("MCP.so ownership linkage");
      expect(generated).toContain("Official MCP Registry");
    } finally {
      rmSync(targetRoot, { recursive: true, force: true });
    }
  });
});
