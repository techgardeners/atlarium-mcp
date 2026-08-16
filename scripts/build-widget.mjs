import { readFile, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const configFile = resolve(root, "src/apps/habitat-explorer-ui/vite.config.ts");
const outputDirectory = resolve(root, "dist/widget");
const temporaryArtifact = resolve(outputDirectory, "index.html");
const artifact = resolve(outputDirectory, "habitat-explorer.v4.html");
const maximumGzipBytes = 500 * 1024;

await build({ configFile });
await rename(temporaryArtifact, artifact);

const html = await readFile(artifact, "utf8");
const gzipBytes = gzipSync(html).byteLength;

if (gzipBytes > maximumGzipBytes) {
  throw new Error(
    `Habitat Explorer bundle is ${gzipBytes} gzip bytes; the production budget is ${maximumGzipBytes}.`,
  );
}

console.log(
  JSON.stringify({
    artifact: "dist/widget/habitat-explorer.v4.html",
    bytes: Buffer.byteLength(html),
    gzipBytes,
    budgetBytes: maximumGzipBytes,
  }),
);
