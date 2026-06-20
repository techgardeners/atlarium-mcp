import "dotenv/config";
import { z } from "zod";

export type TrustProxyConfig = false | number | string;

const booleanFlagSchema = z
  .preprocess(
    (value) => (typeof value === "string" ? value.toLowerCase() : value),
    z.enum(["true", "false"]).default("true"),
  )
  .transform((value) => value === "true");

const languageSchema = z.enum(["it", "en", "es"]).default("en");
const trustProxySchema = z
  .string()
  .trim()
  .default("1")
  .transform((value, ctx): TrustProxyConfig => {
    const normalized = value.toLowerCase();

    if (["false", "0", "off", "none"].includes(normalized)) {
      return false;
    }

    if (["loopback", "linklocal", "uniquelocal"].includes(normalized)) {
      return normalized;
    }

    const hops = Number(normalized);
    if (Number.isInteger(hops) && hops > 0 && hops <= 10) {
      return hops;
    }

    ctx.addIssue({
      code: "custom",
      message:
        "MCP_TRUST_PROXY must be false, a hop count from 1 to 10, or one of loopback/linklocal/uniquelocal.",
    });
    return z.NEVER;
  });

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    MCP_SERVICE_NAME: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .default("Atlarium Habitat Database MCP"),
    MCP_VERSION: z.string().trim().min(1).max(40).default("2.0.0"),
    MCP_PORT: z.coerce.number().int().min(1).max(65_535).default(43118),
    MCP_PUBLIC_BASE_URL: z.url().default("https://mcp.atlarium.bio"),
    ATLARIUM_API_BASE_URL: z.url().default("https://atlarium.bio/api/public/mcp/v1"),
    MCP_DEFAULT_LANGUAGE: languageSchema,
    MCP_RATE_LIMIT_ENABLED: booleanFlagSchema,
    MCP_RATE_LIMIT_WINDOW_MS: z.coerce
      .number()
      .int()
      .min(1_000)
      .max(3_600_000)
      .default(60_000),
    MCP_RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(10_000).default(120),
    MCP_ALLOWED_HOSTS: z.string().trim().optional().default(""),
    MCP_TRUST_PROXY: trustProxySchema,
    ATLARIUM_API_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(30_000).default(5_000),
    ATLARIUM_API_RESPONSE_MAX_BYTES: z.coerce
      .number()
      .int()
      .min(1_024)
      .max(5_000_000)
      .default(1_048_576),
    OPENAI_APPS_CHALLENGE_TOKEN: z
      .string()
      .trim()
      .min(1)
      .max(256)
      .default("tW6HmNIvGw-oL1mq-d0brGwZl-quGv5UFBw66EqtS4g"),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== "production") {
      return;
    }

    for (const key of ["MCP_PUBLIC_BASE_URL", "ATLARIUM_API_BASE_URL"] as const) {
      if (new URL(env[key]).protocol !== "https:") {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: `${key} must use https in production.`,
        });
      }
    }
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
  const host = value.trim().toLowerCase();
  try {
    return new URL(`http://${host}`).hostname;
  } catch {
    return host;
  }
}

function unique(values: string[]) {
  return [...new Set(values)];
}

export function getRuntimeConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = envSchema.parse(env);
  const publicBaseUrl = new URL(parsed.MCP_PUBLIC_BASE_URL);
  const atlariumApiBaseUrl = new URL(parsed.ATLARIUM_API_BASE_URL);
  const explicitHosts = unique(csv(parsed.MCP_ALLOWED_HOSTS).map(normalizeHost));

  return {
    ...parsed,
    publicBaseUrl,
    atlariumApiBaseUrl,
    host: "0.0.0.0",
    trustProxy: parsed.MCP_TRUST_PROXY,
    allowedHosts:
      explicitHosts.length > 0
        ? explicitHosts
        : unique([publicBaseUrl.hostname.toLowerCase(), "localhost", "127.0.0.1"]),
  };
}
