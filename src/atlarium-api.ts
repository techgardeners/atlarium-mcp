import type { RuntimeConfig, SupportedLanguage } from "./config.js";
import { ToolExecutionError } from "./errors.js";
import type {
  convertUnitsSchema,
  compatibilitySchema,
  equipmentRequirementsSchema,
  fertilizationPlanSchema,
  fertilizerDoseSchema,
  getProfileSchema,
  getPathProfileSchema,
  habitatSuggestionSchema,
  listProductBrandsSchema,
  listProductCategoriesSchema,
  searchDiagnosticsSchema,
  searchEquipmentSchema,
  searchFertilizationRegimesSchema,
  searchFertilizersSchema,
  searchFishSchema,
  searchGuidesSchema,
  searchPlantsSchema,
  searchProductsSchema,
  suggestionsSchema,
  tankVolumeSchema,
  tankWeightSchema,
  waterParametersSchema,
  waterChangeSchema,
  waterChemistrySchema,
} from "./schemas.js";
import type { z } from "zod";

type Fetch = typeof fetch;
type QueryValue = boolean | number | string | undefined;

type SearchFishInput = z.infer<typeof searchFishSchema>;
type SearchPlantsInput = z.infer<typeof searchPlantsSchema>;
type SearchProductsInput = z.infer<typeof searchProductsSchema>;
type SearchEquipmentInput = z.infer<typeof searchEquipmentSchema>;
type SearchFertilizersInput = z.infer<typeof searchFertilizersSchema>;
type SearchDiagnosticsInput = z.infer<typeof searchDiagnosticsSchema>;
type ListProductCategoriesInput = z.infer<typeof listProductCategoriesSchema>;
type ListProductBrandsInput = z.infer<typeof listProductBrandsSchema>;
type SearchFertilizationRegimesInput = z.infer<typeof searchFertilizationRegimesSchema>;
type GetProfileInput = z.infer<typeof getProfileSchema>;
type GetPathProfileInput = z.infer<typeof getPathProfileSchema>;
type CompatibilityInput = z.infer<typeof compatibilitySchema>;
type WaterParametersInput = z.infer<typeof waterParametersSchema>;
type SuggestionsInput = z.infer<typeof suggestionsSchema>;
type SearchGuidesInput = z.infer<typeof searchGuidesSchema>;
type FertilizerDoseInput = z.infer<typeof fertilizerDoseSchema>;
type FertilizationPlanInput = z.infer<typeof fertilizationPlanSchema>;
type TankVolumeInput = z.infer<typeof tankVolumeSchema>;
type TankWeightInput = z.infer<typeof tankWeightSchema>;
type WaterChangeInput = z.infer<typeof waterChangeSchema>;
type WaterChemistryInput = z.infer<typeof waterChemistrySchema>;
type ConvertUnitsInput = z.infer<typeof convertUnitsSchema>;
type EquipmentRequirementsInput = z.infer<typeof equipmentRequirementsSchema>;
type HabitatSuggestionInput = z.infer<typeof habitatSuggestionSchema>;

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

function pathSegments(slug: string) {
  return slug.split("/").filter(Boolean).map(encodeURIComponent).join("/");
}

function stripProductPrefix(slug: string, prefixes: string[]) {
  for (const prefix of prefixes) {
    if (slug.startsWith(`${prefix}/`)) {
      return slug.slice(prefix.length + 1);
    }
  }
  return slug;
}

export class AtlariumApiClient {
  constructor(
    private readonly config: RuntimeConfig,
    private readonly fetchImpl: Fetch = fetch,
  ) {}

  async searchFish(input: SearchFishInput) {
    return this.get("fish", this.withDefaultLanguage(input));
  }

  async getFishProfile(input: GetProfileInput) {
    return this.get(`fish/${encodeURIComponent(input.slug)}`, {
      language: this.language(input.language),
    });
  }

  async searchPlants(input: SearchPlantsInput) {
    return this.get("plants", this.withDefaultLanguage(input));
  }

  async getPlantProfile(input: GetProfileInput) {
    return this.get(`plants/${encodeURIComponent(input.slug)}`, {
      language: this.language(input.language),
    });
  }

  async searchProducts(input: SearchProductsInput) {
    return this.get("products", this.withDefaultLanguage(input));
  }

  async getProductProfile(input: GetPathProfileInput) {
    return this.get(`products/${input.slug.split("/").map(encodeURIComponent).join("/")}`, {
      language: this.language(input.language),
    });
  }

  async checkSpeciesCompatibility(input: CompatibilityInput) {
    return this.post("compatibility", {
      species: input.species,
      language: this.language(input.language),
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
      { language: this.language(input.language) },
    );
  }

  async suggestSpeciesForTank(input: SuggestionsInput) {
    return this.get("suggestions", {
      tank_liters: input.tank_liters,
      language: this.language(input.language),
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
    return this.get("guides", this.withDefaultLanguage(input));
  }

  async getGuide(input: GetPathProfileInput) {
    return this.get(`guides/${input.slug.split("/").map(encodeURIComponent).join("/")}`, {
      language: this.language(input.language),
    });
  }

  async searchAlgae(input: SearchDiagnosticsInput) {
    return this.get("diagnostics/algae", this.withDefaultLanguage(input));
  }

  async getAlgaeProfile(input: GetProfileInput) {
    return this.get(`diagnostics/algae/${encodeURIComponent(input.slug)}`, {
      language: this.language(input.language),
    });
  }

  async searchDiseases(input: SearchDiagnosticsInput) {
    return this.get("diagnostics/diseases", this.withDefaultLanguage(input));
  }

  async getDiseaseProfile(input: GetProfileInput) {
    return this.get(`diagnostics/diseases/${encodeURIComponent(input.slug)}`, {
      language: this.language(input.language),
    });
  }

  async searchPlantProblems(input: SearchDiagnosticsInput) {
    return this.get("diagnostics/plant-problems", this.withDefaultLanguage(input));
  }

  async getPlantProblemProfile(input: GetProfileInput) {
    return this.get(`diagnostics/plant-problems/${encodeURIComponent(input.slug)}`, {
      language: this.language(input.language),
    });
  }

  async searchMedicines(input: SearchDiagnosticsInput) {
    return this.get("diagnostics/medicines", this.withDefaultLanguage(input));
  }

  async getMedicineProfile(input: GetProfileInput) {
    return this.get(`diagnostics/medicines/${encodeURIComponent(input.slug)}`, {
      language: this.language(input.language),
    });
  }

  async matchDiagnosticProfiles(input: SearchDiagnosticsInput) {
    return this.post("diagnostics/match", {
      ...input,
      language: this.language(input.language),
    });
  }

  async listProductCategories(input: ListProductCategoriesInput) {
    return this.get("products/categories", {
      language: this.language(input.language),
      product_type: input.type,
    });
  }

  async listProductBrands(input: ListProductBrandsInput) {
    return this.get("products/brands", this.withDefaultLanguage(input));
  }

  async searchEquipment(input: SearchEquipmentInput) {
    return this.get("products/equipment", this.withDefaultLanguage(input));
  }

  async getEquipmentProfile(input: GetPathProfileInput) {
    const slug = stripProductPrefix(input.slug, ["equipment"]);
    return this.get(`products/equipment/${pathSegments(slug)}`, {
      language: this.language(input.language),
    });
  }

  async searchFertilizers(input: SearchFertilizersInput) {
    return this.get("products/fertilizers", this.withDefaultLanguage(input));
  }

  async getFertilizerProfile(input: GetPathProfileInput) {
    const slug = stripProductPrefix(input.slug, ["fertilizer", "fertilizers"]);
    return this.get(`products/fertilizers/${pathSegments(slug)}`, {
      language: this.language(input.language),
    });
  }

  async searchFertilizationRegimes(input: SearchFertilizationRegimesInput) {
    return this.get("fertilization-regimes", this.withDefaultLanguage(input));
  }

  async getFertilizationRegime(input: GetProfileInput) {
    return this.get(`fertilization-regimes/${encodeURIComponent(input.slug)}`, {
      language: this.language(input.language),
    });
  }

  async calculateFertilizerDose(input: FertilizerDoseInput) {
    return this.post("fertilization/fertilizer-dose", input);
  }

  async calculateNutrientGaps(input: FertilizationPlanInput) {
    return this.post("fertilization/nutrient-gaps", {
      ...input,
      language: this.language(input.language),
    });
  }

  async calculateWeeklyDoseTotals(input: FertilizationPlanInput) {
    return this.post("fertilization/weekly-dose-totals", {
      ...input,
      language: this.language(input.language),
    });
  }

  async generateFertilizationPlan(input: FertilizationPlanInput) {
    return this.post("fertilization/plan", {
      ...input,
      language: this.language(input.language),
    });
  }

  async calculateTankVolume(input: TankVolumeInput) {
    return this.post("calculators/tank-volume", input);
  }

  async calculateTankWeight(input: TankWeightInput) {
    return this.post("calculators/tank-weight", input);
  }

  async calculateWaterChange(input: WaterChangeInput) {
    return this.post("calculators/water-change", input);
  }

  async calculateWaterChemistry(input: WaterChemistryInput) {
    return this.post("calculators/water-chemistry", input);
  }

  async convertUnits(input: ConvertUnitsInput) {
    return this.post("calculators/convert-units", input);
  }

  async calculateEquipmentRequirements(input: EquipmentRequirementsInput) {
    return this.post("calculators/equipment-requirements", input);
  }

  async suggestHabitatForTank(input: HabitatSuggestionInput) {
    return this.post("habitat-suggestions", {
      ...input,
      language: this.language(input.language),
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
        redirect: "error",
        signal: AbortSignal.timeout(this.config.ATLARIUM_API_TIMEOUT_MS),
        headers: {
          accept: "application/json",
          ...(init?.headers ?? {}),
        },
      });
    } catch (error) {
      if (isTimeoutError(error)) {
        throw new ToolExecutionError(
          "atlarium_api_timeout",
          "Atlarium public API timed out.",
          504,
        );
      }

      throw new ToolExecutionError(
        "atlarium_api_unavailable",
        "Atlarium public API is unavailable.",
        502,
      );
    }

    const text = await readResponseText(
      response,
      this.config.ATLARIUM_API_RESPONSE_MAX_BYTES,
    );

    if (!response.ok) {
      if (response.status >= 500) {
        throw new ToolExecutionError(
          "atlarium_api_error",
          "Atlarium public API error.",
          response.status,
        );
      }

      const payload = text ? safeJsonOrNull(text) : null;
      const error = apiError(payload);
      throw new ToolExecutionError(error.code, error.message, response.status);
    }

    return text ? safeJson(text) : null;
  }

  private language(language: SupportedLanguage | undefined) {
    return language ?? this.config.MCP_DEFAULT_LANGUAGE;
  }

  private withDefaultLanguage<T extends { language?: SupportedLanguage }>(
    input: T,
  ): T & { language: SupportedLanguage } {
    return {
      ...input,
      language: this.language(input.language),
    };
  }
}

async function readResponseText(response: Response, maxBytes: number) {
  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new ToolExecutionError(
      "atlarium_response_too_large",
      "Atlarium public API response is too large.",
      502,
    );
  }

  if (!response.body) {
    const text = await response.text();
    if (Buffer.byteLength(text, "utf8") > maxBytes) {
      throw new ToolExecutionError(
        "atlarium_response_too_large",
        "Atlarium public API response is too large.",
        502,
      );
    }
    return text;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let bytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      bytes += value.byteLength;
      if (bytes > maxBytes) {
        throw new ToolExecutionError(
          "atlarium_response_too_large",
          "Atlarium public API response is too large.",
          502,
        );
      }

      chunks.push(decoder.decode(value, { stream: true }));
    }
  } finally {
    reader.releaseLock();
  }

  chunks.push(decoder.decode());
  return chunks.join("");
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

function safeJsonOrNull(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
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

function isTimeoutError(error: unknown) {
  return (
    error &&
    typeof error === "object" &&
    "name" in error &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  );
}
