import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("widget build concurrency", () => {
  it(
    "publishes a complete artifact when two canonical builds overlap",
    async () => {
      const build = () =>
        execFileAsync(process.execPath, ["scripts/build-widget.mjs"], {
          cwd: process.cwd(),
          maxBuffer: 2 * 1024 * 1024,
        });

      const results = await Promise.all([build(), build()]);
      for (const result of results) {
        expect(result.stdout).toContain(
          '"artifact":"dist/widget/habitat-explorer.v4.html"',
        );
      }

      const artifact = await readFile(
        "dist/widget/habitat-explorer.v4.html",
        "utf8",
      );
      expect(artifact).toContain("<html");
      expect(artifact).toContain("openai:set_globals");
    },
    30_000,
  );
});
