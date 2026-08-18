import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type DistributionTarget = {
  id: string;
  status: string;
  evidence: string;
  publicPage?: boolean;
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

  it("aligns server.json with either the published release or its explicit candidate", () => {
    const server = JSON.parse(readFileSync("server.json", "utf8")) as {
      version: string;
    };
    const registryTarget = registry.targets.find(
      (target) => target.id === "official_registry",
    );
    const mcpFindTarget = registry.targets.find(
      (target) => target.id === "mcp_find",
    );

    expect(registry.release.candidateVersion ?? registry.release.version).toBe(server.version);
    expect(registryTarget?.evidence).toContain(registry.release.version);
    expect(mcpFindTarget?.submission?.payload.package).toMatch(
      /^ghcr\.io\/techgardeners\/atlarium-mcp:\d+\.\d+\.\d+$/,
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

  it("keeps the current ChatGPT candidate prepared without approval claims", () => {
    const target = registry.targets.find(
      (candidate) => candidate.id === "chatgpt_app",
    );

    expect(target).toMatchObject({
      status: "prepared",
      publicPage: false,
    });
    expect(target?.evidence).toMatch(new RegExp(`${registry.release.version}.*draft`, "i"));
    expect(target?.evidence).toMatch(/39 public tools/i);
    expect(target?.evidence).toMatch(/three compliant 706px/i);
    expect(target?.evidence).toMatch(/uploaded and saved/i);
    expect(target?.evidence).toMatch(/native mobile recording/i);
    expect(target?.evidence).not.toMatch(
      new RegExp(`${registry.release.version}[^.]*approved`, "i"),
    );
    expect(target?.evidence).not.toMatch(
      new RegExp(`${registry.release.version}[^.]*submitted`, "i"),
    );
    expect(target?.submission).toBeUndefined();
  });

  it("does not invent a GitHub MCP Registry submission path", () => {
    const target = registry.targets.find(
      (candidate) => candidate.id === "github_mcp_registry",
    );

    expect(target).toMatchObject({
      status: "blocked",
      publicPage: false,
    });
    expect(target?.evidence).toMatch(/curated selection/i);
    expect(target?.evidence).toMatch(/no public self-submission flow/i);
    expect(target?.submission).toBeUndefined();
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

      expect(generated).toContain(`"version": "${registry.release.version}"`);
      expect(generated).toContain(
        `"candidateVersion": ${JSON.stringify(registry.release.candidateVersion ?? null)}`,
      );
      expect(generated).not.toContain("MCP Trove");
      expect(generated).not.toContain("MCP.so ownership linkage");
      expect(generated).toContain("Official MCP Registry");
    } finally {
      rmSync(targetRoot, { recursive: true, force: true });
    }
  });

  it("generates directory payloads from the published release without static scores", () => {
    execFileSync(
      process.execPath,
      ["scripts/submit-directories.mjs", "--payload"],
      { stdio: "pipe" },
    );
    const payload = readFileSync(
      "tmp/directory-submissions/secondary-directory-payloads.md",
      "utf8",
    );

    expect(payload).toContain(`Release: ${registry.release.version}`);
    if (registry.release.candidateVersion) {
      expect(payload).not.toContain(`Release: ${registry.release.candidateVersion}`);
    }
    expect(payload).not.toMatch(/Quality score:\s*\d/i);
  });
});
