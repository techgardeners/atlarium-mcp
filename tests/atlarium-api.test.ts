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
});
