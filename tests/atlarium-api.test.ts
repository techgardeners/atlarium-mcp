import { beforeEach, describe, expect, it, vi } from "vitest";

import { AtlariumApiClient } from "../src/atlarium-api.js";
import { getRuntimeConfig } from "../src/config.js";
import { ToolExecutionError } from "../src/errors.js";

const config = getRuntimeConfig({
  NODE_ENV: "test",
  ATLARIUM_API_BASE_URL: "http://localhost:43117/api/public/mcp/v1",
});

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(
    new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  );
});

describe("Atlarium API client", () => {
  it("maps search_fish inputs to the public provider query contract", async () => {
    const api = new AtlariumApiClient(config, fetchMock);

    await api.searchFish({
      language: "en",
      limit: 10,
      max_tank_liters: 80,
      query: "neon",
    });

    const url = fetchMock.mock.calls[0]?.[0] as URL;
    expect(url.origin + url.pathname).toBe(
      "http://localhost:43117/api/public/mcp/v1/fish",
    );
    expect(Object.fromEntries(url.searchParams.entries())).toEqual({
      language: "en",
      limit: "10",
      max_tank_liters: "80",
      query: "neon",
    });
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      redirect: "error",
    });
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it("maps composite product slugs without flattening path segments", async () => {
    const api = new AtlariumApiClient(config, fetchMock);

    await api.getProductProfile({
      language: "it",
      slug: "equipment/filters/eheim/classic-150",
    });

    const url = fetchMock.mock.calls[0]?.[0] as URL;
    expect(url.href).toBe(
      "http://localhost:43117/api/public/mcp/v1/products/equipment/filters/eheim/classic-150?language=it",
    );
  });

  it("uses the configured default language when a tool omits language", async () => {
    const api = new AtlariumApiClient(
      getRuntimeConfig({
        NODE_ENV: "test",
        ATLARIUM_API_BASE_URL: "http://localhost:43117/api/public/mcp/v1",
        MCP_DEFAULT_LANGUAGE: "it",
      }),
      fetchMock,
    );

    await api.searchPlants({ query: "anubias" });

    const url = fetchMock.mock.calls[0]?.[0] as URL;
    expect(Object.fromEntries(url.searchParams.entries())).toEqual({
      language: "it",
      query: "anubias",
    });
  });

  it("turns provider errors into sanitized tool errors", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: { code: "not_found", message: "Resource not found." },
        }),
        { status: 404, headers: { "content-type": "application/json" } },
      ),
    );
    const api = new AtlariumApiClient(config, fetchMock);

    await expect(api.getFishProfile({ slug: "missing" })).rejects.toMatchObject({
      code: "not_found",
      message: "Resource not found.",
    } satisfies Partial<ToolExecutionError>);
  });

  it("does not expose upstream 5xx error details", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: { code: "database_error", message: "internal storage detail" },
        }),
        { status: 503, headers: { "content-type": "application/json" } },
      ),
    );
    const api = new AtlariumApiClient(config, fetchMock);

    await expect(api.getFishProfile({ slug: "neon-tetra" })).rejects.toMatchObject({
      code: "atlarium_api_error",
      message: "Atlarium public API error.",
      status: 503,
    } satisfies Partial<ToolExecutionError>);
  });

  it("turns upstream timeouts into gateway timeout tool errors", async () => {
    fetchMock.mockRejectedValueOnce(
      Object.assign(new Error("signal timed out"), { name: "TimeoutError" }),
    );
    const api = new AtlariumApiClient(config, fetchMock);

    await expect(api.searchGuides({ query: "algae" })).rejects.toMatchObject({
      code: "atlarium_api_timeout",
      status: 504,
    } satisfies Partial<ToolExecutionError>);
  });

  it("rejects invalid successful JSON responses", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("not json", {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const api = new AtlariumApiClient(config, fetchMock);

    await expect(api.searchGuides({ query: "algae" })).rejects.toMatchObject({
      code: "invalid_atlarium_response",
      status: 502,
    } satisfies Partial<ToolExecutionError>);
  });

  it("rejects upstream responses over the configured byte limit", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          "content-type": "application/json",
          "content-length": "1025",
        },
      }),
    );
    const api = new AtlariumApiClient(
      getRuntimeConfig({
        NODE_ENV: "test",
        ATLARIUM_API_BASE_URL: "http://localhost:43117/api/public/mcp/v1",
        ATLARIUM_API_RESPONSE_MAX_BYTES: "1024",
      }),
      fetchMock,
    );

    await expect(api.searchGuides({ query: "algae" })).rejects.toMatchObject({
      code: "atlarium_response_too_large",
      status: 502,
    } satisfies Partial<ToolExecutionError>);
  });
});
