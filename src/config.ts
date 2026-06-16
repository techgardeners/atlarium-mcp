import "dotenv/config";
import { z } from "zod";

const booleanFlagSchema = z
  .preprocess(
    (value) => (typeof value === "string" ? value.toLowerCase() : value),
    z.enum(["true", "false"]).default("true"),
  )
  .transform((value) => value === "true");

const languageSchema = z.enum(["it", "en", "es"]).default("en");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MCP_SERVICE_NAME: z.string().trim().min(1).default("atlarium-mcp"),
  MCP_VERSION: z.string().trim().min(1).default("1.0.0"),
  MCP_PORT: z.coerce.number().int().positive().default(43118),
  MCP_PUBLIC_BASE_URL: z.url().default("https://mcp.atlarium.bio"),
  ATLARIUM_API_BASE_URL: z.url().default("https://atlarium.bio/api/public/mcp/v1"),
  MCP_DEFAULT_LANGUAGE: languageSchema,
  MCP_RATE_LIMIT_ENABLED: booleanFlagSchema,
  MCP_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  MCP_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  MCP_ALLOWED_HOSTS: z.string().trim().optional().default(""),
});

export type SupportedLanguage = z.infer<typeof languageSchema>;
export type RuntimeConfig = ReturnType<typeof getRuntimeConfig>;

function csv(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeHost(value: string) {
  try {
    return new URL(`http://${value}`).hostname;
  } catch {
    return value;
  }
}

export function getRuntimeConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = envSchema.parse(env);
  const publicBaseUrl = new URL(parsed.MCP_PUBLIC_BASE_URL);
  const atlariumApiBaseUrl = new URL(parsed.ATLARIUM_API_BASE_URL);
  const explicitHosts = csv(parsed.MCP_ALLOWED_HOSTS).map(normalizeHost);

  return {
    ...parsed,
    publicBaseUrl,
    atlariumApiBaseUrl,
    host: "0.0.0.0",
    allowedHosts: explicitHosts.length > 0
      ? explicitHosts
      : [publicBaseUrl.hostname, "localhost", "127.0.0.1"],
  };
}
