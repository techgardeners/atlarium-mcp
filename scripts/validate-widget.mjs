import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const root = resolve(import.meta.dirname, "..");
const artifact = resolve(root, "dist/widget/habitat-explorer.v4.html");
const html = await readFile(artifact, "utf8");
const requiredMarkers = [
  "Atlarium Habitat Explorer",
  "openai:set_globals",
  "ui/notifications/tool-result",
  "requestDisplayMode",
  "setWidgetState",
  "notifyIntrinsicHeight",
  "data:image/webp",
  "data-brand-logo",
];
const forbiddenMarkers = [
  "rail-button",
  "Filter visible habitat data",
  "Suggest 90 L planted tank",
  "aequidens-pulcher",
  "paracheirodon-innesi",
  "<iframe",
];

for (const marker of requiredMarkers) {
  if (!html.includes(marker)) throw new Error(`Widget artifact is missing required marker: ${marker}`);
}
for (const marker of forbiddenMarkers) {
  if (html.includes(marker)) throw new Error(`Widget artifact contains forbidden marker: ${marker}`);
}
if (/<script[^>]+src=/i.test(html) || /<link[^>]+rel=["']stylesheet/i.test(html)) {
  throw new Error("Widget artifact is not self-contained.");
}

const gzipBytes = gzipSync(html).byteLength;
if (gzipBytes > 500 * 1024) throw new Error(`Widget artifact exceeds 500 KB gzip: ${gzipBytes}`);

console.log(JSON.stringify({ valid: true, gzipBytes, requiredMarkers: requiredMarkers.length }));
