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
