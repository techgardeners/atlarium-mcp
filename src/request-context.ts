import { AsyncLocalStorage } from "node:async_hooks";

export type McpRequestContext = {
  probe?: string;
  rpc_method?: string;
  tool?: string;
};

const requestContext = new AsyncLocalStorage<McpRequestContext>();
const SAFE_TOKEN = /^[a-zA-Z0-9._/-]{1,80}$/;

export function createMcpRequestContext(
  body: unknown,
  probeHeader: string | string[] | undefined,
  publicTools: ReadonlySet<string>,
): McpRequestContext {
  const request = asRecord(body);
  const params = asRecord(request.method === "tools/call" ? request.params : undefined);
  const rpcMethod = safeToken(request.method);
  const requestedTool = safeToken(params.name);
  const probeValue = Array.isArray(probeHeader) ? probeHeader[0] : probeHeader;
  const probe = safeToken(probeValue);

  return {
    ...(probe ? { probe } : {}),
    ...(rpcMethod ? { rpc_method: rpcMethod } : {}),
    ...(requestedTool && publicTools.has(requestedTool) ? { tool: requestedTool } : {}),
  };
}

export function runWithMcpRequestContext<T>(
  context: McpRequestContext,
  callback: () => T,
) {
  return requestContext.run(context, callback);
}

export function mcpRequestLogFields() {
  return requestContext.getStore() ?? {};
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function safeToken(value: unknown) {
  return typeof value === "string" && SAFE_TOKEN.test(value) ? value : undefined;
}
