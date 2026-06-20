import { z } from "zod";

export const languageSchema = z.enum(["it", "en", "es"]);
const optionalLanguage = languageSchema.optional();
const searchLimit = z.number().int().positive().max(50).optional();
const suggestionLimit = z.number().int().positive().max(30).optional();
const offset = z.number().int().min(0).max(10_000).optional();
const searchText = z.string().trim().max(120);
const filterText = z.string().trim().min(1).max(80);
const speciesName = z.string().trim().min(1).max(120);
const tankLiters = z.number().finite().positive().max(100_000);
const tankLiterFilter = z.number().finite().min(0).max(100_000);
const ph = z.number().finite().min(0).max(14);
const hardness = z.number().finite().min(0).max(100);
const temperature = z.number().finite().min(0).max(45);
const singleSlug = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/i, "Slug must be a single safe path segment.");
const pathSlug = z
  .string()
  .trim()
  .min(1)
  .max(240)
  .regex(
    /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*$/i,
    "Slug path must contain safe path segments.",
  );

export const searchFishSchema = z
  .object({
    query: searchText.optional(),
    language: optionalLanguage,
    min_tank_liters: tankLiterFilter.optional(),
    max_tank_liters: tankLiterFilter.optional(),
    ph_min: ph.optional(),
    ph_max: ph.optional(),
    gh_min: hardness.optional(),
    gh_max: hardness.optional(),
    kh_min: hardness.optional(),
    kh_max: hardness.optional(),
    temperature_min: temperature.optional(),
    temperature_max: temperature.optional(),
    temperament: filterText.optional(),
    care_level: filterText.optional(),
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
    difficulty: filterText.optional(),
    light_requirement: filterText.optional(),
    co2_requirement: filterText.optional(),
    growth_rate: filterText.optional(),
    placement: filterText.optional(),
    limit: searchLimit,
    offset,
  })
  .strict();

export const searchProductsSchema = z
  .object({
    query: searchText.optional(),
    language: optionalLanguage,
    category: filterText.optional(),
    brand: filterText.optional(),
    use_case: filterText.optional(),
    limit: searchLimit,
    offset,
  })
  .strict();

export const compatibilitySchema = z
  .object({
    species: z.array(speciesName).min(1).max(20),
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
    type: z.enum(["fish", "plant"]),
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
    beginner_friendly: z.boolean().optional(),
    planted_tank: z.boolean().optional(),
    limit: suggestionLimit,
  })
  .strict();

export const searchGuidesSchema = z
  .object({
    query: searchText.optional(),
    language: optionalLanguage,
    topic: filterText.optional(),
    limit: searchLimit,
    offset,
  })
  .strict();

const diagnosticDifficulty = z.number().int().min(1).max(5);
const calculatorNumber = z.number().finite();
const nonNegativeCalculatorNumber = calculatorNumber.min(0);
const boundedCalculatorNumber = (min: number, max: number) =>
  calculatorNumber.min(min).max(max);
const nutrientTarget = calculatorNumber.nullable().optional();

export const searchDiagnosticsSchema = z
  .object({
    query: searchText.optional(),
    language: optionalLanguage,
    difficulty: diagnosticDifficulty.optional(),
    type: filterText.optional(),
    water_type: filterText.optional(),
    limit: searchLimit,
    offset,
  })
  .strict();

export const listProductCategoriesSchema = z
  .object({
    language: optionalLanguage,
    type: z.enum(["equipment", "fertilizer"]).optional(),
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
    topic: filterText.optional(),
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
    brand_name: z.string().trim().min(1).max(120).optional(),
    product_name: z.string().trim().min(1).max(160),
    volume_liters: tankLiters,
  })
  .strict();

export const nutrientTargetsSchema = z
  .object({
    boron_mg_l: nutrientTarget,
    calcium_mg_l: nutrientTarget,
    copper_mg_l: nutrientTarget,
    iron_mg_l: nutrientTarget,
    magnesium_mg_l: nutrientTarget,
    manganese_mg_l: nutrientTarget,
    molybdenum_mg_l: nutrientTarget,
    nitrogen_mg_l: nutrientTarget,
    phosphorus_mg_l: nutrientTarget,
    potassium_mg_l: nutrientTarget,
    zinc_mg_l: nutrientTarget,
  })
  .strict();

const weekDay = z.number().int().min(1).max(7);

export const fertilizationPlanItemSchema = z
  .object({
    brand_name: z.string().trim().min(1).max(120).nullable().optional(),
    product_name: z.string().trim().min(1).max(160),
    method: z.enum(["LIQUID", "ROOT_TAB", "POWDER", "CAPSULE"]),
    dose_value: nonNegativeCalculatorNumber.max(1_000_000),
    dose_unit: z.string().trim().min(1).max(20).default("ml"),
    days_of_week: z.array(weekDay).min(1).max(7),
    sort_order: z.number().int().min(0).max(1_000).default(0),
    notes: z.string().trim().max(500).nullable().optional(),
  })
  .strict();

export const fertilizationMeasurementSchema = z
  .object({
    kind: z.string().trim().min(1).max(30),
    value: calculatorNumber.nullable().optional(),
    measured_at: z.string().datetime().nullable().optional(),
  })
  .strict();

export const fertilizationPlanSchema = z
  .object({
    items: z.array(fertilizationPlanItemSchema).max(50).optional(),
    language: optionalLanguage,
    measurements: z.array(fertilizationMeasurementSchema).max(100).optional(),
    regime: z.string().trim().min(1).max(80).nullable().optional(),
    targets: nutrientTargetsSchema.optional(),
    volume_liters: tankLiters,
  })
  .strict();

export const tankVolumeSchema = z
  .object({
    bow_depth_cm: boundedCalculatorNumber(0, 1_000).optional(),
    diameter_cm: boundedCalculatorNumber(0, 5_000).optional(),
    glass_thickness_mm: boundedCalculatorNumber(0, 100).optional(),
    hardscape_displacement_liters: boundedCalculatorNumber(0, 100_000).optional(),
    height_cm: boundedCalculatorNumber(0, 5_000).optional(),
    length_cm: boundedCalculatorNumber(0, 5_000).optional(),
    shape: z.enum(["rect", "cyl", "bow"]),
    substrate_depth_cm: boundedCalculatorNumber(0, 1_000).optional(),
    water_density_kg_per_liter: boundedCalculatorNumber(0.5, 2).optional(),
    water_height_cm: boundedCalculatorNumber(0, 5_000).optional(),
    width_cm: boundedCalculatorNumber(0, 5_000).optional(),
  })
  .strict();

export const tankWeightSchema = tankVolumeSchema.extend({
  equipment_weight_kg: boundedCalculatorNumber(0, 1_000_000).optional(),
  glass_weight_override_kg: boundedCalculatorNumber(0, 1_000_000).optional(),
  hardscape_weight_kg: boundedCalculatorNumber(0, 1_000_000).optional(),
  substrate_density_kg_per_liter: boundedCalculatorNumber(0.1, 20).optional(),
  substrate_weight_override_kg: boundedCalculatorNumber(0, 1_000_000).optional(),
});

export const waterChangeSchema = z
  .object({
    change_percent: boundedCalculatorNumber(0, 100).optional(),
    changes_per_week: z.number().int().min(0).max(50).optional(),
    volume_liters: boundedCalculatorNumber(0, 100_000).optional(),
  })
  .strict();

export const waterChemistrySchema = z
  .object({
    carbonate_hardness: z
      .object({
        unit: z.enum(["dkh", "fh", "ppm", "meq"]),
        value: boundedCalculatorNumber(0, 10_000),
      })
      .strict()
      .optional(),
    co2: z
      .object({
        kh_dkh: boundedCalculatorNumber(0, 1_000),
        ph,
      })
      .strict()
      .optional(),
    general_hardness: z
      .object({
        unit: z.enum(["dgh", "fh", "ppm", "mmol"]),
        value: boundedCalculatorNumber(0, 10_000),
      })
      .strict()
      .optional(),
    salinity: z
      .object({
        current_ppt: boundedCalculatorNumber(0, 500).optional(),
        salinity_ppt: boundedCalculatorNumber(0, 500).optional(),
        target_ppt: boundedCalculatorNumber(0, 500).optional(),
        temperature_c: boundedCalculatorNumber(-10, 60).optional(),
        volume_liters: boundedCalculatorNumber(0, 100_000).optional(),
      })
      .strict()
      .optional(),
    water_mix: z
      .object({
        source1_gh: boundedCalculatorNumber(0, 10_000).optional(),
        source2_gh: boundedCalculatorNumber(0, 10_000).optional(),
        target_gh: boundedCalculatorNumber(0, 10_000).optional(),
        total_liters: boundedCalculatorNumber(0, 100_000).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const convertUnitsSchema = z
  .object({
    length: z
      .object({
        unit: z.enum(["cm", "mm", "in", "ft"]),
        value: boundedCalculatorNumber(0, 1_000_000),
      })
      .strict()
      .optional(),
    temperature: z
      .object({
        unit: z.enum(["c", "f", "k"]),
        value: boundedCalculatorNumber(-500, 10_000),
      })
      .strict()
      .optional(),
    temperature_delta: z
      .object({
        from_c: boundedCalculatorNumber(-500, 10_000),
        to_c: boundedCalculatorNumber(-500, 10_000),
      })
      .strict()
      .optional(),
    volume: z
      .object({
        unit: z.enum(["l", "ml", "galUs", "galUk", "flOz"]),
        value: boundedCalculatorNumber(0, 1_000_000),
      })
      .strict()
      .optional(),
    weight: z
      .object({
        unit: z.enum(["g", "kg", "oz", "lb"]),
        value: boundedCalculatorNumber(0, 1_000_000_000),
      })
      .strict()
      .optional(),
  })
  .strict();

export const equipmentRequirementsSchema = z
  .object({
    electricity: z
      .object({
        cost_per_kwh: boundedCalculatorNumber(0, 1_000).optional(),
        duty_cycle_percent: boundedCalculatorNumber(0, 100).optional(),
        hours_per_day: boundedCalculatorNumber(0, 24).optional(),
        wattage: boundedCalculatorNumber(0, 1_000_000).optional(),
      })
      .strict()
      .optional(),
    heater: z
      .object({
        ambient_c: boundedCalculatorNumber(-50, 80).optional(),
        insulation: z.enum(["good", "normal", "poor"]),
        target_c: boundedCalculatorNumber(-50, 80).optional(),
        volume_liters: boundedCalculatorNumber(0, 100_000).optional(),
      })
      .strict()
      .optional(),
    lighting: z
      .object({
        lumens: boundedCalculatorNumber(0, 10_000_000).optional(),
        volume_liters: boundedCalculatorNumber(0, 100_000).optional(),
        watts: boundedCalculatorNumber(0, 1_000_000).optional(),
      })
      .strict()
      .optional(),
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
    beginner_friendly: z.boolean().optional(),
    planted_tank: z.boolean().optional(),
    limit: suggestionLimit,
    co2: z.enum(["none", "low", "injected"]).optional(),
    light_level: z.enum(["low", "medium", "high"]).optional(),
    setup_intent: z.enum(["community", "shrimp", "planted", "breeding"]).optional(),
    target_difficulty: z.enum(["easy", "balanced", "expert"]).optional(),
    tds: hardness.optional(),
    water_type: z
      .enum(["FRESHWATER", "MARINE", "BRACKISH", "TERRESTRIAL", "SEMI_AQUATIC"])
      .optional(),
  })
  .strict();
