const DEFAULT_ATTEMPTS = 3;
const DEFAULT_DELAY_MS = 1_000;
const MAX_ATTEMPTS = 5;
const MAX_DELAY_MS = 30_000;
const MAX_ERROR_DETAIL_LENGTH = 500;

export class ContractValidationError extends Error {}

export class TransientProbeError extends Error {}

export function assertContract(condition, message) {
  if (!condition) {
    throw new ContractValidationError(message);
  }
}

export function publicProbeRetryOptions(env = process.env) {
  return {
    attempts: positiveInteger(
      env.MCP_PUBLIC_PROBE_ATTEMPTS,
      DEFAULT_ATTEMPTS,
      "MCP_PUBLIC_PROBE_ATTEMPTS",
      MAX_ATTEMPTS,
    ),
    delayMs: positiveInteger(
      env.MCP_PUBLIC_PROBE_RETRY_DELAY_MS,
      DEFAULT_DELAY_MS,
      "MCP_PUBLIC_PROBE_RETRY_DELAY_MS",
      MAX_DELAY_MS,
    ),
  };
}

export async function withTransientRetries(
  operation,
  {
    attempts = DEFAULT_ATTEMPTS,
    delayMs = DEFAULT_DELAY_MS,
    onRetry = () => {},
    sleep = defaultSleep,
  } = {},
) {
  positiveInteger(attempts, DEFAULT_ATTEMPTS, "attempts", MAX_ATTEMPTS);
  positiveInteger(delayMs, DEFAULT_DELAY_MS, "delayMs", MAX_DELAY_MS);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof ContractValidationError || attempt === attempts) {
        throw error;
      }

      const nextDelayMs = delayMs * 2 ** (attempt - 1);
      await onRetry({
        attempt,
        attempts,
        delayMs: nextDelayMs,
        error,
      });
      await sleep(nextDelayMs);
    }
  }

  throw new Error("retry loop ended without a result");
}

export function transientToolResultError(tool, result) {
  const detail = toolResultErrorDetail(result);
  return new TransientProbeError(
    `${tool} returned an MCP tool error${detail ? `: ${detail}` : ""}`,
  );
}

export function conciseError(error) {
  const message = error instanceof Error ? error.message : String(error);
  const cause = error instanceof Error ? error.cause : undefined;
  const causeCode =
    cause && typeof cause === "object" && "code" in cause
      ? String(cause.code)
      : undefined;

  return truncate(normalize([message, causeCode].filter(Boolean).join(" ")));
}

function toolResultErrorDetail(result) {
  const messages = Array.isArray(result?.content)
    ? result.content
        .filter((item) => item?.type === "text" && typeof item.text === "string")
        .map((item) => item.text)
    : [];

  return truncate(normalize(messages.join(" ")));
}

function positiveInteger(value, fallback, name, maximum) {
  const parsed = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw new Error(`${name} must be an integer from 1 to ${maximum}`);
  }
  return parsed;
}

function normalize(value) {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value) {
  if (value.length <= MAX_ERROR_DETAIL_LENGTH) {
    return value;
  }
  return `${value.slice(0, MAX_ERROR_DETAIL_LENGTH - 1)}…`;
}

function defaultSleep(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
