import { mkdir, mkdtemp, readFile, rename, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const configFile = resolve(root, "src/apps/habitat-explorer-ui/vite.config.ts");
const outputDirectory = resolve(root, "dist/widget");
const artifact = resolve(outputDirectory, "habitat-explorer.v4.html");
const maximumGzipBytes = 500 * 1024;

await mkdir(outputDirectory, { recursive: true });
const buildDirectory = await mkdtemp(resolve(outputDirectory, ".build-"));
const temporaryArtifact = resolve(buildDirectory, "index.html");

try {
  await build({
    configFile,
    build: {
      outDir: buildDirectory,
      emptyOutDir: true,
    },
  });

  const html = await readFile(temporaryArtifact, "utf8");
  const gzipBytes = gzipSync(html).byteLength;

  if (gzipBytes > maximumGzipBytes) {
    throw new Error(
      `Habitat Explorer bundle is ${gzipBytes} gzip bytes; the production budget is ${maximumGzipBytes}.`,
    );
  }

  // Each invocation builds in its own directory. The final rename is atomic, so
  // overlapping lint/test/build jobs cannot consume or remove one another's
  // intermediate index.html file.
  await rename(temporaryArtifact, artifact);

  console.log(
    JSON.stringify({
      artifact: "dist/widget/habitat-explorer.v4.html",
      bytes: Buffer.byteLength(html),
      gzipBytes,
      budgetBytes: maximumGzipBytes,
    }),
  );
} finally {
  await rm(buildDirectory, { recursive: true, force: true });
}
