import { getRuntimeConfig } from "./config.js";
import { log } from "./logger.js";
import { listen } from "./http.js";

const config = getRuntimeConfig();
const server = listen(config);

function shutdown(signal: string) {
  log("info", "mcp_shutdown", { signal });
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
