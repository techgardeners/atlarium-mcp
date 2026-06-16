import { getRuntimeConfig } from "./config.js";
import { log } from "./logger.js";
import { listen } from "./http.js";

const config = getRuntimeConfig();
const server = listen(config);
const SHUTDOWN_TIMEOUT_MS = 10_000;
let shuttingDown = false;

function shutdown(signal: string) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  log("info", "mcp_shutdown", { signal });
  const timeout = setTimeout(() => {
    log("error", "mcp_shutdown_timeout", { signal });
    server.closeAllConnections();
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  timeout.unref();

  server.closeIdleConnections();
  server.close(() => {
    clearTimeout(timeout);
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
