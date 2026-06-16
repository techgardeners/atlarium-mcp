import type { RuntimeConfig } from "./config.js";
import { ToolExecutionError } from "./errors.js";
import type {
  compatibilitySchema,
  getProfileSchema,
  searchFishSchema,
  searchGuidesSchema,
  searchPlantsSchema,
  searchProductsSchema,
  suggestionsSchema,
  waterParametersSchema,
} from "./schemas.js";
import type { z } from "zod";

type Fetch = typeof fetch;
type QueryValue = boolean | number | string | undefined;

type SearchFishInput = z.infer<typeof searchFishSchema>;
type SearchPlantsInput = z.infer<typeof searchPlantsSchema>;
type SearchProductsInput = z.infer<typeof searchProductsSchema>;
type GetProfileInput = z.infer<typeof getProfileSchema>;
type CompatibilityInput = z.infer<typeof compatibilitySchema>;
type WaterParametersInput = z.infer<typeof waterParametersSchema>;
type SuggestionsInput = z.infer<typeof suggestionsSchema>;
type SearchGuidesInput = z.infer<typeof searchGuidesSchema>;

function appendQuery(url: URL, params: Record<string, QueryValue>) {
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }

    url.searchParams.set(key, String(value));
  }
}

function booleanParam(value: boolean | undefined) {
  return value === undefined ? undefined : String(value);
}

export class AtlariumApiClient {
  constructor(
    private readonly config: RuntimeConfig,
    private readonly fetchImpl: Fetch = fetch,
  ) {}

  async searchFish(input: SearchFishInput) {
    return this.get("fish", input);
  }

  async getFishProfile(input: GetProfileInput) {
    return this.get(`fish/${encodeURIComponent(input.slug)}`, {
      language: input.language,
    });
  }

  async searchPlants(input: SearchPlantsInput) {
    return this.get("plants", input);
  }

  async getPlantProfile(input: GetProfileInput) {
    return this.get(`plants/${encodeURIComponent(input.slug)}`, {
      language: input.language,
    });
  }

  async searchProducts(input: SearchProductsInput) {
    return this.get("products", input);
  }

  async getProductProfile(input: GetProfileInput) {
    return this.get(`products/${input.slug.split("/").map(encodeURIComponent).join("/")}`, {
      language: input.language,
    });
  }

  async checkSpeciesCompatibility(input: CompatibilityInput) {
    return this.post("compatibility", {
      species: input.species,
      language: input.language,
      tank_liters: input.tank_liters,
      ph: input.ph,
      gh: input.gh,
      kh: input.kh,
      temperature: input.temperature,
    });
  }

  async getWaterParameters(input: WaterParametersInput) {
    return this.get(
      `water-parameters/${input.type}/${encodeURIComponent(input.slug)}`,
      { language: input.language },
    );
  }

  async suggestSpeciesForTank(input: SuggestionsInput) {
    return this.get("suggestions", {
      tank_liters: input.tank_liters,
      language: input.language,
      ph: input.ph,
      gh: input.gh,
      kh: input.kh,
      temperature: input.temperature,
      beginner_friendly: booleanParam(input.beginner_friendly),
      planted_tank: booleanParam(input.planted_tank),
      limit: input.limit,
    });
  }

  async searchGuides(input: SearchGuidesInput) {
    return this.get("guides", input);
  }

  async getGuide(input: GetProfileInput) {
    return this.get(`guides/${input.slug.split("/").map(encodeURIComponent).join("/")}`, {
      language: input.language,
    });
  }

  private async get(path: string, params: Record<string, QueryValue>) {
    const url = this.url(path);
    appendQuery(url, params);
    return this.request(url);
  }

  private async post(path: string, body: unknown) {
    return this.request(this.url(path), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  private url(path: string) {
    const base = this.config.atlariumApiBaseUrl.href.replace(/\/+$/, "");
    return new URL(`${base}/${path.replace(/^\/+/, "")}`);
  }

  private async request(url: URL, init?: RequestInit) {
    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        ...init,
        headers: {
          accept: "application/json",
          ...(init?.headers ?? {}),
        },
      });
    } catch {
      throw new ToolExecutionError(
        "atlarium_api_unavailable",
        "Atlarium public API is unavailable.",
        502,
      );
    }

    const text = await response.text();
    const payload = text ? safeJson(text) : null;

    if (!response.ok) {
      const error = apiError(payload);
      throw new ToolExecutionError(error.code, error.message, response.status);
    }

    return payload;
  }
}

function safeJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ToolExecutionError(
      "invalid_atlarium_response",
      "Atlarium public API returned invalid JSON.",
      502,
    );
  }
}

function apiError(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object"
  ) {
    const error = payload.error as { code?: unknown; message?: unknown };
    return {
      code: typeof error.code === "string" ? error.code : "atlarium_api_error",
      message:
        typeof error.message === "string"
          ? error.message
          : "Atlarium public API error.",
    };
  }

  return {
    code: "atlarium_api_error",
    message: "Atlarium public API error.",
  };
}
