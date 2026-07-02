import { ZodError, z } from "zod";

import { habitatExplorerToolMeta } from "./apps/habitat-explorer.js";
import { AtlariumApiClient } from "./atlarium-api.js";
import { errorMessage } from "./errors.js";
import { log } from "./logger.js";
import { jsonText } from "./serialization.js";
import {
  compatibilitySchema,
  convertUnitsSchema,
  equipmentRequirementsSchema,
  fertilizationPlanSchema,
  fertilizerDoseSchema,
  getFertilizationRegimeSchema,
  getPathProfileSchema,
  getProfileSchema,
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
  waterChangeSchema,
  waterChemistrySchema,
  waterParametersSchema,
} from "./schemas.js";

type ToolSchema = z.ZodObject<z.ZodRawShape>;
type ToolInput = Record<string, unknown>;

export const appToolOutputSchema = z
  .object({
    data: z.unknown(),
    tool: z.string(),
  })
  .strict();

export type ToolDefinition = {
  name: string;
  title: string;
  description: string;
  schema: ToolSchema;
  outputSchema?: typeof appToolOutputSchema;
  appMeta?: Record<string, unknown>;
  readOnly: true;
  handler: (api: AtlariumApiClient, input: ToolInput) => Promise<unknown>;
};

function publicTool(
  name: string,
  title: string,
  description: string,
  schema: ToolSchema,
  handler: ToolDefinition["handler"],
): ToolDefinition {
  return {
    name,
    title,
    description,
    schema,
    outputSchema: appToolOutputSchema,
    appMeta: habitatExplorerToolMeta,
    readOnly: true,
    handler,
  };
}

export const toolDefinitions = [
  publicTool(
    "search_fish",
    "Search fish",
    "Search fish and aquatic animal profiles in the Atlarium habitat database.",
    searchFishSchema,
    (api, input) => api.searchFish(searchFishSchema.parse(input)),
  ),
  publicTool(
    "get_fish_profile",
    "Get fish profile",
    "Get a structured fish or aquatic animal profile from the Atlarium habitat database.",
    getProfileSchema,
    (api, input) => api.getFishProfile(getProfileSchema.parse(input)),
  ),
  publicTool(
    "search_plants",
    "Search plants",
    "Search aquatic plants in the Atlarium database.",
    searchPlantsSchema,
    (api, input) => api.searchPlants(searchPlantsSchema.parse(input)),
  ),
  publicTool(
    "get_plant_profile",
    "Get plant profile",
    "Get a structured aquatic plant profile.",
    getProfileSchema,
    (api, input) => api.getPlantProfile(getProfileSchema.parse(input)),
  ),
  publicTool(
    "search_products",
    "Search products",
    "Search public habitat products in the Atlarium database.",
    searchProductsSchema,
    (api, input) => api.searchProducts(searchProductsSchema.parse(input)),
  ),
  publicTool(
    "get_product_profile",
    "Get product profile",
    "Get a structured public habitat product profile.",
    getPathProfileSchema,
    (api, input) => api.getProductProfile(getPathProfileSchema.parse(input)),
  ),
  publicTool(
    "check_species_compatibility",
    "Check species compatibility",
    "Check basic compatibility information between habitat species using Atlarium data.",
    compatibilitySchema,
    (api, input) => api.checkSpeciesCompatibility(compatibilitySchema.parse(input)),
  ),
  publicTool(
    "get_water_parameters",
    "Get water parameters",
    "Get recommended water parameters for an aquatic species or plant.",
    waterParametersSchema,
    (api, input) => api.getWaterParameters(waterParametersSchema.parse(input)),
  ),
  publicTool(
    "suggest_species_for_tank",
    "Suggest species for tank",
    "Suggest compatible aquatic species based on tank size and water parameters.",
    suggestionsSchema,
    (api, input) => api.suggestSpeciesForTank(suggestionsSchema.parse(input)),
  ),
  publicTool(
    "search_guides",
    "Search guides",
    "Search Atlarium habitat guides and educational content.",
    searchGuidesSchema,
    (api, input) => api.searchGuides(searchGuidesSchema.parse(input)),
  ),
  publicTool(
    "get_guide",
    "Get guide",
    "Get a structured public Atlarium guide.",
    getPathProfileSchema,
    (api, input) => api.getGuide(getPathProfileSchema.parse(input)),
  ),
  publicTool(
    "search_algae",
    "Search algae",
    "Search public algae diagnostic profiles with symptoms, causes and treatment guidance.",
    searchDiagnosticsSchema,
    (api, input) => api.searchAlgae(searchDiagnosticsSchema.parse(input)),
  ),
  publicTool(
    "get_algae_profile",
    "Get algae profile",
    "Get a structured public algae diagnostic profile.",
    getProfileSchema,
    (api, input) => api.getAlgaeProfile(getProfileSchema.parse(input)),
  ),
  publicTool(
    "search_diseases",
    "Search diseases",
    "Search public aquatic disease diagnostic profiles and advisory treatment information.",
    searchDiagnosticsSchema,
    (api, input) => api.searchDiseases(searchDiagnosticsSchema.parse(input)),
  ),
  publicTool(
    "get_disease_profile",
    "Get disease profile",
    "Get a structured public aquatic disease profile.",
    getProfileSchema,
    (api, input) => api.getDiseaseProfile(getProfileSchema.parse(input)),
  ),
  publicTool(
    "search_plant_problems",
    "Search plant problems",
    "Search public aquatic plant deficiency, pest and environmental problem profiles.",
    searchDiagnosticsSchema,
    (api, input) => api.searchPlantProblems(searchDiagnosticsSchema.parse(input)),
  ),
  publicTool(
    "get_plant_problem_profile",
    "Get plant problem profile",
    "Get a structured public aquatic plant problem or deficiency profile.",
    getProfileSchema,
    (api, input) => api.getPlantProblemProfile(getProfileSchema.parse(input)),
  ),
  publicTool(
    "search_medicines",
    "Search medicines",
    "Search public aquarium medicine and treatment product profiles.",
    searchDiagnosticsSchema,
    (api, input) => api.searchMedicines(searchDiagnosticsSchema.parse(input)),
  ),
  publicTool(
    "get_medicine_profile",
    "Get medicine profile",
    "Get a structured public aquarium medicine profile.",
    getProfileSchema,
    (api, input) => api.getMedicineProfile(getProfileSchema.parse(input)),
  ),
  publicTool(
    "match_diagnostic_profiles",
    "Match diagnostic profiles",
    "Find likely public algae, disease, plant problem and medicine profiles from a symptom query.",
    searchDiagnosticsSchema,
    (api, input) => api.matchDiagnosticProfiles(searchDiagnosticsSchema.parse(input)),
  ),
  publicTool(
    "list_product_categories",
    "List product categories",
    "List public Atlarium product categories for equipment and fertilizers.",
    listProductCategoriesSchema,
    (api, input) => api.listProductCategories(listProductCategoriesSchema.parse(input)),
  ),
  publicTool(
    "list_product_brands",
    "List product brands",
    "List public Atlarium product brands.",
    listProductBrandsSchema,
    (api, input) => api.listProductBrands(listProductBrandsSchema.parse(input)),
  ),
  publicTool(
    "search_equipment",
    "Search equipment",
    "Search public aquarium and habitat equipment products.",
    searchEquipmentSchema,
    (api, input) => api.searchEquipment(searchEquipmentSchema.parse(input)),
  ),
  publicTool(
    "get_equipment_profile",
    "Get equipment profile",
    "Get a structured public equipment product profile.",
    getPathProfileSchema,
    (api, input) => api.getEquipmentProfile(getPathProfileSchema.parse(input)),
  ),
  publicTool(
    "search_fertilizers",
    "Search fertilizers",
    "Search public aquarium fertilizer products and nutrient profiles.",
    searchFertilizersSchema,
    (api, input) => api.searchFertilizers(searchFertilizersSchema.parse(input)),
  ),
  publicTool(
    "get_fertilizer_profile",
    "Get fertilizer profile",
    "Get a structured public fertilizer product profile.",
    getPathProfileSchema,
    (api, input) => api.getFertilizerProfile(getPathProfileSchema.parse(input)),
  ),
  publicTool(
    "search_fertilization_regimes",
    "Search fertilization regimes",
    "Search public fertilization regimes and dosing philosophies.",
    searchFertilizationRegimesSchema,
    (api, input) =>
      api.searchFertilizationRegimes(searchFertilizationRegimesSchema.parse(input)),
  ),
  publicTool(
    "get_fertilization_regime",
    "Get fertilization regime",
    "Get a structured public fertilization regime.",
    getFertilizationRegimeSchema,
    (api, input) =>
      api.getFertilizationRegime(getFertilizationRegimeSchema.parse(input)),
  ),
  publicTool(
    "calculate_fertilizer_dose",
    "Calculate fertilizer dose",
    "Calculate an advisory fertilizer dose for a public catalog product and tank volume.",
    fertilizerDoseSchema,
    (api, input) => api.calculateFertilizerDose(fertilizerDoseSchema.parse(input)),
  ),
  publicTool(
    "calculate_nutrient_gaps",
    "Calculate nutrient gaps",
    "Compare nutrient targets with supplied measurements without saving user data.",
    fertilizationPlanSchema,
    (api, input) => api.calculateNutrientGaps(fertilizationPlanSchema.parse(input)),
  ),
  publicTool(
    "calculate_weekly_dose_totals",
    "Calculate weekly dose totals",
    "Calculate weekly fertilizer totals for a supplied non-persistent dosing plan.",
    fertilizationPlanSchema,
    (api, input) => api.calculateWeeklyDoseTotals(fertilizationPlanSchema.parse(input)),
  ),
  publicTool(
    "generate_fertilization_plan",
    "Generate fertilization plan",
    "Generate an advisory non-persistent fertilization plan from public Atlarium catalog data.",
    fertilizationPlanSchema,
    (api, input) => api.generateFertilizationPlan(fertilizationPlanSchema.parse(input)),
  ),
  publicTool(
    "calculate_tank_volume",
    "Calculate tank volume",
    "Calculate gross and net aquarium volume estimates from dimensions.",
    tankVolumeSchema,
    (api, input) => api.calculateTankVolume(tankVolumeSchema.parse(input)),
  ),
  publicTool(
    "calculate_tank_weight",
    "Calculate tank weight",
    "Calculate advisory aquarium weight estimates from dimensions and material inputs.",
    tankWeightSchema,
    (api, input) => api.calculateTankWeight(tankWeightSchema.parse(input)),
  ),
  publicTool(
    "calculate_water_change",
    "Calculate water change",
    "Calculate water change volume, weekly totals and dilution estimates.",
    waterChangeSchema,
    (api, input) => api.calculateWaterChange(waterChangeSchema.parse(input)),
  ),
  publicTool(
    "calculate_water_chemistry",
    "Calculate water chemistry",
    "Calculate public water chemistry conversions, CO2, salinity and water-mix estimates.",
    waterChemistrySchema,
    (api, input) => api.calculateWaterChemistry(waterChemistrySchema.parse(input)),
  ),
  publicTool(
    "convert_units",
    "Convert units",
    "Convert aquarium-relevant temperature, length, weight and volume units.",
    convertUnitsSchema,
    (api, input) => api.convertUnits(convertUnitsSchema.parse(input)),
  ),
  publicTool(
    "calculate_equipment_requirements",
    "Calculate equipment requirements",
    "Calculate advisory heater, lighting and electricity requirements.",
    equipmentRequirementsSchema,
    (api, input) =>
      api.calculateEquipmentRequirements(equipmentRequirementsSchema.parse(input)),
  ),
  publicTool(
    "suggest_habitat_for_tank",
    "Suggest habitat for tank",
    "Suggest a complete public habitat plan with species, plants, products, warnings, motivations and related guides.",
    habitatSuggestionSchema,
    (api, input) => api.suggestHabitatForTank(habitatSuggestionSchema.parse(input)),
  ),
] satisfies ToolDefinition[];

export function toolJson(value: unknown) {
  return {
    structuredContent: value,
    content: [{ type: "text" as const, text: jsonText(value) }],
  };
}

export function toolError(error: unknown) {
  const message =
    error instanceof ZodError
      ? error.issues.map((issue) => issue.message).join("; ")
      : errorMessage(error);

  return {
    isError: true,
    content: [{ type: "text" as const, text: message }],
  };
}

export async function runTool(
  name: string,
  handler: () => Promise<unknown>,
) {
  const startedAt = Date.now();
  try {
    const value = await handler();
    const structuredContent = {
      data: value,
      tool: name,
    };
    log("info", "mcp_tool_call", {
      tool: name,
      duration_ms: Date.now() - startedAt,
      status: "ok",
    });
    return {
      structuredContent,
      content: [{ type: "text" as const, text: jsonText(value) }],
    };
  } catch (error) {
    log("warn", "mcp_tool_call", {
      tool: name,
      duration_ms: Date.now() - startedAt,
      status: "error",
      error: errorMessage(error),
    });
    return toolError(error);
  }
}
