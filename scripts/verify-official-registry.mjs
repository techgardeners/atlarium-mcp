#!/usr/bin/env node
import { readFileSync } from "node:fs";

const serverJson = JSON.parse(readFileSync("server.json", "utf8"));
const registryUrl = new URL("https://registry.modelcontextprotocol.io/v0.1/servers");
registryUrl.searchParams.set("search", serverJson.name);
registryUrl.searchParams.set("version", serverJson.version);

const response = await fetch(registryUrl);
if (!response.ok) {
  throw new Error(`Official Registry verification returned HTTP ${response.status}.`);
}

const payload = await response.json();
const match = (payload.servers ?? []).find((entry) => {
  const official = entry._meta?.["io.modelcontextprotocol.registry/official"];
  return (
    entry.server?.name === serverJson.name &&
    entry.server?.version === serverJson.version &&
    official?.status === "active" &&
    official?.isLatest === true
  );
});

if (!match) {
  throw new Error(
    `Official Registry does not expose ${serverJson.name} ${serverJson.version} as active/latest.`,
  );
}

const official = match._meta["io.modelcontextprotocol.registry/official"];
console.log(
  JSON.stringify({
    name: match.server.name,
    version: match.server.version,
    status: official.status,
    isLatest: official.isLatest,
    publishedAt: official.publishedAt,
  }),
);
