import { z } from "zod";

export const languageSchema = z
  .enum(["it", "en", "es"])
  .describe("Preferred response language: Italian, English or Spanish.");
const optionalLanguage = languageSchema
  .optional()
  .describe("Optional preferred response language: it, en or es.");
const searchLimit = z
  .number()
  .int()
  .positive()
  .max(50)
  .optional()
  .describe("Maximum number of public records to return, up to 50.");
const suggestionLimit = z
  .number()
  .int()
  .positive()
  .max(30)
  .optional()
  .describe("Maximum number of suggestions to return, up to 30.");
const offset = z
  .number()
  .int()
  .min(0)
  .max(10_000)
  .optional()
  .describe("Zero-based pagination offset for public search results.");
const searchText = z
  .string()
  .trim()
  .max(120)
  .describe("Search text used to match public Atlarium records.");
const filterText = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .describe("Facet filter text such as category, topic, type, difficulty or requirement.");
const speciesName = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .describe("Species common name, scientific name or slug to evaluate.");
const tankLiters = z
  .number()
  .finite()
  .positive()
  .max(100_000)
  .describe("Tank or habitat volume in liters.");
const tankLiterFilter = z
  .number()
  .finite()
  .min(0)
  .max(100_000)
  .describe("Tank volume filter in liters.");
const ph = z
  .number()
  .finite()
  .min(0)
  .max(14)
  .describe("Water pH value on the 0 to 14 scale.");
const hardness = z
  .number()
  .finite()
  .min(0)
  .max(100)
  .describe("Water hardness, conductivity or TDS-style value for advisory matching.");
const temperature = z
  .number()
  .finite()
  .min(0)
  .max(45)
  .describe("Water or ambient temperature in degrees Celsius.");
const singleSlug = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/i, "Slug must be a single safe path segment.")
  .describe("Single safe public Atlarium slug without path separators.");
const pathSlug = z
  .string()
  .trim()
  .min(1)
  .max(240)
  .regex(
    /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*$/i,
    "Slug path must contain safe path segments.",
  )
  .describe("Safe public Atlarium slug path made of one or more path segments.");

export const searchFishSchema = z
  .object({
    query: searchText.optional(),
    language: optionalLanguage,
    min_tank_liters: tankLiterFilter.optional().describe("Minimum tank volume filter in liters."),
    max_tank_liters: tankLiterFilter.optional().describe("Maximum tank volume filter in liters."),
    ph_min: ph.optional().describe("Minimum acceptable pH filter."),
    ph_max: ph.optional().describe("Maximum acceptable pH filter."),
    gh_min: hardness.optional().describe("Minimum general hardness filter."),
    gh_max: hardness.optional().describe("Maximum general hardness filter."),
    kh_min: hardness.optional().describe("Minimum carbonate hardness filter."),
    kh_max: hardness.optional().describe("Maximum carbonate hardness filter."),
    temperature_min: temperature.optional().describe("Minimum temperature filter in Celsius."),
    temperature_max: temperature.optional().describe("Maximum temperature filter in Celsius."),
    temperament: filterText.optional().describe("Temperament filter, for example peaceful or aggressive."),
    care_level: filterText.optional().describe("Care-level filter, for example easy, moderate or expert."),
    limit: searchLimit,
    offset,
  })
  .strict();

export const getProfileSchema = z
  .object({
    slug: singleSlug,
    language: optionalLanguage,
  })
  .strict();

export const getPathProfileSchema = z
  .object({
    slug: pathSlug,
    language: optionalLanguage,
  })
  .strict();

export const searchPlantsSchema = z
  .object({
    query: searchText.optional(),
    language: optionalLanguage,
    difficulty: filterText.optional().describe("Plant difficulty filter."),
    light_requirement: filterText.optional().describe("Lighting requirement filter."),
    co2_requirement: filterText.optional().describe("CO2 requirement filter."),
    growth_rate: filterText.optional().describe("Growth-rate filter."),
    placement: filterText.optional().describe("Aquascape placement filter such as foreground or background."),
    limit: searchLimit,
    offset,
  })
  .strict();

export const searchProductsSchema = z
  .object({
    query: searchText.optional(),
    language: optionalLanguage,
    category: filterText.optional().describe("Product category filter."),
    brand: filterText.optional().describe("Product brand filter."),
    use_case: filterText.optional().describe("Use-case filter such as filtration, lighting or fertilization."),
    limit: searchLimit,
    offset,
  })
  .strict();

export const compatibilitySchema = z
  .object({
    species: z
      .array(speciesName)
      .min(1)
      .max(20)
      .describe("List of species names or slugs to compare, from 1 to 20 entries."),
    language: optionalLanguage,
    tank_liters: tankLiters.optional(),
    ph: ph.optional(),
    gh: hardness.optional(),
    kh: hardness.optional(),
    temperature: temperature.optional(),
  })
  .strict();

export const waterParametersSchema = z
  .object({
    slug: singleSlug,
    type: z.enum(["fish", "plant"]).describe("Profile type to read water parameters for."),
    language: optionalLanguage,
  })
  .strict();

export const suggestionsSchema = z
  .object({
    tank_liters: tankLiters,
    language: optionalLanguage,
    ph: ph.optional(),
    gh: hardness.optional(),
    kh: hardness.optional(),
    temperature: temperature.optional(),
    beginner_friendly: z
      .boolean()
      .optional()
      .describe("When true, prefer species that are suitable for beginners."),
    planted_tank: z
      .boolean()
      .optional()
      .describe("When true, prefer suggestions compatible with planted aquariums."),
    limit: suggestionLimit,
  })
  .strict();

export const searchGuidesSchema = z
  .object({
    query: searchText.optional(),
    language: optionalLanguage,
    topic: filterText.optional().describe("Guide topic filter."),
    limit: searchLimit,
    offset,
  })
  .strict();

const diagnosticDifficulty = z
  .number()
  .int()
  .min(1)
  .max(5)
  .describe("Diagnostic difficulty filter from 1 to 5.");
const calculatorNumber = z.number().finite().describe("Finite numeric value for advisory calculations.");
const nonNegativeCalculatorNumber = calculatorNumber
  .min(0)
  .describe("Non-negative numeric value for advisory calculations.");
const boundedCalculatorNumber = (min: number, max: number) =>
  calculatorNumber.min(min).max(max);
const nutrientTarget = calculatorNumber
  .nullable()
  .optional()
  .describe("Target nutrient concentration in mg/L; omit or use null when unknown.");

export const searchDiagnosticsSchema = z
  .object({
    query: searchText.optional(),
    language: optionalLanguage,
    difficulty: diagnosticDifficulty.optional(),
    type: filterText.optional().describe("Diagnostic profile type filter."),
    water_type: filterText.optional().describe("Water or habitat type filter."),
    limit: searchLimit,
    offset,
  })
  .strict();

export const listProductCategoriesSchema = z
  .object({
    language: optionalLanguage,
    type: z
      .enum(["equipment", "fertilizer"])
      .optional()
      .describe("Limit categories to equipment or fertilizer catalog entries."),
  })
  .strict();

export const listProductBrandsSchema = z
  .object({
    language: optionalLanguage,
    query: searchText.optional(),
  })
  .strict();

export const searchEquipmentSchema = searchProductsSchema;
export const searchFertilizersSchema = searchProductsSchema;

export const searchFertilizationRegimesSchema = z
  .object({
    query: searchText.optional(),
    language: optionalLanguage,
    topic: filterText.optional().describe("Fertilization regime topic filter."),
    limit: searchLimit,
    offset,
  })
  .strict();

export const getFertilizationRegimeSchema = z
  .object({
    slug: singleSlug,
    language: optionalLanguage,
  })
  .strict();

export const fertilizerDoseSchema = z
  .object({
    brand_name: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .optional()
      .describe("Optional public fertilizer brand name."),
    product_name: z
      .string()
      .trim()
      .min(1)
      .max(160)
      .describe("Public fertilizer product name."),
    volume_liters: tankLiters,
  })
  .strict();

export const nutrientTargetsSchema = z
  .object({
    boron_mg_l: nutrientTarget.describe("Target boron concentration in mg/L."),
    calcium_mg_l: nutrientTarget.describe("Target calcium concentration in mg/L."),
    copper_mg_l: nutrientTarget.describe("Target copper concentration in mg/L."),
    iron_mg_l: nutrientTarget.describe("Target iron concentration in mg/L."),
    magnesium_mg_l: nutrientTarget.describe("Target magnesium concentration in mg/L."),
    manganese_mg_l: nutrientTarget.describe("Target manganese concentration in mg/L."),
    molybdenum_mg_l: nutrientTarget.describe("Target molybdenum concentration in mg/L."),
    nitrogen_mg_l: nutrientTarget.describe("Target nitrogen concentration in mg/L."),
    phosphorus_mg_l: nutrientTarget.describe("Target phosphorus concentration in mg/L."),
    potassium_mg_l: nutrientTarget.describe("Target potassium concentration in mg/L."),
    zinc_mg_l: nutrientTarget.describe("Target zinc concentration in mg/L."),
  })
  .strict();

const weekDay = z
  .number()
  .int()
  .min(1)
  .max(7)
  .describe("Day of week number from 1 to 7.");

export const fertilizationPlanItemSchema = z
  .object({
    brand_name: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .nullable()
      .optional()
      .describe("Optional fertilizer brand name for this dosing item."),
    product_name: z
      .string()
      .trim()
      .min(1)
      .max(160)
      .describe("Fertilizer product name for this dosing item."),
    method: z
      .enum(["LIQUID", "ROOT_TAB", "POWDER", "CAPSULE"])
      .describe("Dosing method for the fertilizer item."),
    dose_value: nonNegativeCalculatorNumber
      .max(1_000_000)
      .describe("Dose amount per scheduled application."),
    dose_unit: z
      .string()
      .trim()
      .min(1)
      .max(20)
      .default("ml")
      .describe("Dose unit, defaulting to ml."),
    days_of_week: z
      .array(weekDay)
      .min(1)
      .max(7)
      .describe("Scheduled dosing days as numbers from 1 to 7."),
    sort_order: z
      .number()
      .int()
      .min(0)
      .max(1_000)
      .default(0)
      .describe("Optional sort order for displaying plan items."),
    notes: z
      .string()
      .trim()
      .max(500)
      .nullable()
      .optional()
      .describe("Optional non-persistent notes for this dosing item."),
  })
  .strict();

export const fertilizationMeasurementSchema = z
  .object({
    kind: z
      .string()
      .trim()
      .min(1)
      .max(30)
      .describe("Measured nutrient or water parameter name."),
    value: calculatorNumber
      .nullable()
      .optional()
      .describe("Measured numeric value; omit or use null when unknown."),
    measured_at: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .describe("Optional ISO datetime for when the measurement was taken."),
  })
  .strict();

export const fertilizationPlanSchema = z
  .object({
    items: z
      .array(fertilizationPlanItemSchema)
      .max(50)
      .optional()
      .describe("Optional supplied fertilization plan items to analyze."),
    language: optionalLanguage,
    measurements: z
      .array(fertilizationMeasurementSchema)
      .max(100)
      .optional()
      .describe("Optional current measurements for nutrient-gap calculations."),
    regime: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .nullable()
      .optional()
      .describe("Optional fertilization regime name or strategy."),
    targets: nutrientTargetsSchema.optional().describe("Optional target nutrient concentrations."),
    volume_liters: tankLiters,
  })
  .strict();

export const tankVolumeSchema = z
  .object({
    bow_depth_cm: boundedCalculatorNumber(0, 1_000)
      .optional()
      .describe("Curved front depth in centimeters for bow-front tanks."),
    diameter_cm: boundedCalculatorNumber(0, 5_000)
      .optional()
      .describe("Cylinder diameter in centimeters."),
    glass_thickness_mm: boundedCalculatorNumber(0, 100)
      .optional()
      .describe("Glass thickness in millimeters for net volume estimates."),
    hardscape_displacement_liters: boundedCalculatorNumber(0, 100_000)
      .optional()
      .describe("Estimated hardscape displacement in liters."),
    height_cm: boundedCalculatorNumber(0, 5_000)
      .optional()
      .describe("Tank height in centimeters."),
    length_cm: boundedCalculatorNumber(0, 5_000)
      .optional()
      .describe("Tank length in centimeters."),
    shape: z.enum(["rect", "cyl", "bow"]).describe("Tank shape: rectangular, cylindrical or bow-front."),
    substrate_depth_cm: boundedCalculatorNumber(0, 1_000)
      .optional()
      .describe("Substrate depth in centimeters."),
    water_density_kg_per_liter: boundedCalculatorNumber(0.5, 2)
      .optional()
      .describe("Water density in kilograms per liter."),
    water_height_cm: boundedCalculatorNumber(0, 5_000)
      .optional()
      .describe("Actual filled water height in centimeters."),
    width_cm: boundedCalculatorNumber(0, 5_000)
      .optional()
      .describe("Tank width in centimeters."),
  })
  .strict();

export const tankWeightSchema = tankVolumeSchema.extend({
  equipment_weight_kg: boundedCalculatorNumber(0, 1_000_000)
    .optional()
    .describe("Additional equipment weight in kilograms."),
  glass_weight_override_kg: boundedCalculatorNumber(0, 1_000_000)
    .optional()
    .describe("Known glass weight override in kilograms."),
  hardscape_weight_kg: boundedCalculatorNumber(0, 1_000_000)
    .optional()
    .describe("Hardscape weight in kilograms."),
  substrate_density_kg_per_liter: boundedCalculatorNumber(0.1, 20)
    .optional()
    .describe("Substrate density in kilograms per liter."),
  substrate_weight_override_kg: boundedCalculatorNumber(0, 1_000_000)
    .optional()
    .describe("Known substrate weight override in kilograms."),
});

export const waterChangeSchema = z
  .object({
    change_percent: boundedCalculatorNumber(0, 100)
      .optional()
      .describe("Percent of tank volume changed per water change."),
    changes_per_week: z
      .number()
      .int()
      .min(0)
      .max(50)
      .optional()
      .describe("Number of water changes per week."),
    volume_liters: boundedCalculatorNumber(0, 100_000)
      .optional()
      .describe("Tank volume or change volume in liters."),
  })
  .strict();

export const waterChemistrySchema = z
  .object({
    carbonate_hardness: z
      .object({
        unit: z
          .enum(["dkh", "fh", "ppm", "meq"])
          .describe("Carbonate hardness input unit."),
        value: boundedCalculatorNumber(0, 10_000).describe("Carbonate hardness value."),
      })
      .strict()
      .optional()
      .describe("Carbonate hardness conversion input."),
    co2: z
      .object({
        kh_dkh: boundedCalculatorNumber(0, 1_000).describe("Carbonate hardness in dKH."),
        ph,
      })
      .strict()
      .optional()
      .describe("CO2 estimation input from KH and pH."),
    general_hardness: z
      .object({
        unit: z
          .enum(["dgh", "fh", "ppm", "mmol"])
          .describe("General hardness input unit."),
        value: boundedCalculatorNumber(0, 10_000).describe("General hardness value."),
      })
      .strict()
      .optional()
      .describe("General hardness conversion input."),
    salinity: z
      .object({
        current_ppt: boundedCalculatorNumber(0, 500)
          .optional()
          .describe("Current salinity in parts per thousand."),
        salinity_ppt: boundedCalculatorNumber(0, 500)
          .optional()
          .describe("Measured or source salinity in parts per thousand."),
        target_ppt: boundedCalculatorNumber(0, 500)
          .optional()
          .describe("Target salinity in parts per thousand."),
        temperature_c: boundedCalculatorNumber(-10, 60)
          .optional()
          .describe("Water temperature in Celsius for salinity adjustment."),
        volume_liters: boundedCalculatorNumber(0, 100_000)
          .optional()
          .describe("Water volume in liters for salinity calculations."),
      })
      .strict()
      .optional()
      .describe("Salinity calculation input."),
    water_mix: z
      .object({
        source1_gh: boundedCalculatorNumber(0, 10_000)
          .optional()
          .describe("General hardness of source water 1."),
        source2_gh: boundedCalculatorNumber(0, 10_000)
          .optional()
          .describe("General hardness of source water 2."),
        target_gh: boundedCalculatorNumber(0, 10_000)
          .optional()
          .describe("Target general hardness for the mix."),
        total_liters: boundedCalculatorNumber(0, 100_000)
          .optional()
          .describe("Total mixed water volume in liters."),
      })
      .strict()
      .optional()
      .describe("Water-mixing calculation input."),
  })
  .strict();

export const convertUnitsSchema = z
  .object({
    length: z
      .object({
        unit: z.enum(["cm", "mm", "in", "ft"]).describe("Length input unit."),
        value: boundedCalculatorNumber(0, 1_000_000).describe("Length value to convert."),
      })
      .strict()
      .optional()
      .describe("Length conversion input."),
    temperature: z
      .object({
        unit: z.enum(["c", "f", "k"]).describe("Temperature input unit."),
        value: boundedCalculatorNumber(-500, 10_000).describe("Temperature value to convert."),
      })
      .strict()
      .optional()
      .describe("Temperature conversion input."),
    temperature_delta: z
      .object({
        from_c: boundedCalculatorNumber(-500, 10_000)
          .describe("Starting temperature in Celsius."),
        to_c: boundedCalculatorNumber(-500, 10_000).describe("Target temperature in Celsius."),
      })
      .strict()
      .optional()
      .describe("Temperature difference input."),
    volume: z
      .object({
        unit: z
          .enum(["l", "ml", "galUs", "galUk", "flOz"])
          .describe("Volume input unit."),
        value: boundedCalculatorNumber(0, 1_000_000).describe("Volume value to convert."),
      })
      .strict()
      .optional()
      .describe("Volume conversion input."),
    weight: z
      .object({
        unit: z.enum(["g", "kg", "oz", "lb"]).describe("Weight input unit."),
        value: boundedCalculatorNumber(0, 1_000_000_000).describe("Weight value to convert."),
      })
      .strict()
      .optional()
      .describe("Weight conversion input."),
  })
  .strict();

export const equipmentRequirementsSchema = z
  .object({
    electricity: z
      .object({
        cost_per_kwh: boundedCalculatorNumber(0, 1_000)
          .optional()
          .describe("Electricity cost per kWh."),
        duty_cycle_percent: boundedCalculatorNumber(0, 100)
          .optional()
          .describe("Estimated duty cycle percentage."),
        hours_per_day: boundedCalculatorNumber(0, 24)
          .optional()
          .describe("Daily runtime in hours."),
        wattage: boundedCalculatorNumber(0, 1_000_000)
          .optional()
          .describe("Equipment wattage."),
      })
      .strict()
      .optional()
      .describe("Electricity cost and usage calculation input."),
    heater: z
      .object({
        ambient_c: boundedCalculatorNumber(-50, 80)
          .optional()
          .describe("Ambient room temperature in Celsius."),
        insulation: z
          .enum(["good", "normal", "poor"])
          .describe("Tank insulation quality."),
        target_c: boundedCalculatorNumber(-50, 80)
          .optional()
          .describe("Target water temperature in Celsius."),
        volume_liters: boundedCalculatorNumber(0, 100_000)
          .optional()
          .describe("Tank volume in liters for heater sizing."),
      })
      .strict()
      .optional()
      .describe("Heater sizing input."),
    lighting: z
      .object({
        lumens: boundedCalculatorNumber(0, 10_000_000)
          .optional()
          .describe("Lighting output in lumens."),
        volume_liters: boundedCalculatorNumber(0, 100_000)
          .optional()
          .describe("Tank volume in liters for lighting estimates."),
        watts: boundedCalculatorNumber(0, 1_000_000)
          .optional()
          .describe("Lighting wattage."),
      })
      .strict()
      .optional()
      .describe("Lighting estimate input."),
  })
  .strict();

export const habitatSuggestionSchema = z
  .object({
    tank_liters: tankLiters,
    language: optionalLanguage,
    ph: ph.optional(),
    gh: hardness.optional(),
    kh: hardness.optional(),
    temperature: temperature.optional(),
    beginner_friendly: z
      .boolean()
      .optional()
      .describe("When true, prefer beginner-friendly habitat plans."),
    planted_tank: z
      .boolean()
      .optional()
      .describe("When true, prefer plans designed for planted aquariums."),
    limit: suggestionLimit,
    co2: z
      .enum(["none", "low", "injected"])
      .optional()
      .describe("CO2 setup level for the suggested habitat."),
    light_level: z
      .enum(["low", "medium", "high"])
      .optional()
      .describe("Lighting intensity preference for the suggested habitat."),
    setup_intent: z
      .enum(["community", "shrimp", "planted", "breeding"])
      .optional()
      .describe("Primary setup intent for the habitat plan."),
    target_difficulty: z
      .enum(["easy", "balanced", "expert"])
      .optional()
      .describe("Desired care difficulty for the habitat plan."),
    tds: hardness.optional().describe("Total dissolved solids value for habitat matching."),
    water_type: z
      .enum(["FRESHWATER", "MARINE", "BRACKISH", "TERRESTRIAL", "SEMI_AQUATIC"])
      .optional()
      .describe("Target habitat water or environment type."),
  })
  .strict();
