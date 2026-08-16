import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("local release pipeline", () => {
  it("fails before gates when the Docker runtime is unavailable", () => {
    const result = spawnSync("sh", ["scripts/local-pipeline.sh"], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        ...process.env,
        DOCKER_BIN: "/usr/bin/false",
      },
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Docker is unavailable");
    expect(result.stdout).not.toContain("pnpm lint");
  });
});
