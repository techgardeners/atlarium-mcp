import { z } from "zod";

export const languageSchema = z.enum(["it", "en", "es"]);
const optionalLanguage = languageSchema.optional();
const searchLimit = z.number().int().positive().max(50).optional();
const suggestionLimit = z.number().int().positive().max(30).optional();
const offset = z.number().int().min(0).optional();

export const searchFishSchema = z.object({
  query: z.string().trim().optional(),
  language: optionalLanguage,
  min_tank_liters: z.number().finite().optional(),
  max_tank_liters: z.number().finite().optional(),
  ph_min: z.number().finite().optional(),
  ph_max: z.number().finite().optional(),
  gh_min: z.number().finite().optional(),
  gh_max: z.number().finite().optional(),
  kh_min: z.number().finite().optional(),
  kh_max: z.number().finite().optional(),
  temperature_min: z.number().finite().optional(),
  temperature_max: z.number().finite().optional(),
  temperament: z.string().trim().optional(),
  care_level: z.string().trim().optional(),
  limit: searchLimit,
  offset,
});

export const getProfileSchema = z.object({
  slug: z.string().trim().min(1),
  language: optionalLanguage,
});

export const searchPlantsSchema = z.object({
  query: z.string().trim().optional(),
  language: optionalLanguage,
  difficulty: z.string().trim().optional(),
  light_requirement: z.string().trim().optional(),
  co2_requirement: z.string().trim().optional(),
  growth_rate: z.string().trim().optional(),
  placement: z.string().trim().optional(),
  limit: searchLimit,
  offset,
});

export const searchProductsSchema = z.object({
  query: z.string().trim().optional(),
  language: optionalLanguage,
  category: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  use_case: z.string().trim().optional(),
  limit: searchLimit,
  offset,
});

export const compatibilitySchema = z.object({
  species: z.array(z.string().trim().min(1)).min(1).max(20),
  language: optionalLanguage,
  tank_liters: z.number().finite().positive().optional(),
  ph: z.number().finite().optional(),
  gh: z.number().finite().optional(),
  kh: z.number().finite().optional(),
  temperature: z.number().finite().optional(),
});

export const waterParametersSchema = z.object({
  slug: z.string().trim().min(1),
  type: z.enum(["fish", "plant"]),
  language: optionalLanguage,
});

export const suggestionsSchema = z.object({
  tank_liters: z.number().finite().positive(),
  language: optionalLanguage,
  ph: z.number().finite().optional(),
  gh: z.number().finite().optional(),
  kh: z.number().finite().optional(),
  temperature: z.number().finite().optional(),
  beginner_friendly: z.boolean().optional(),
  planted_tank: z.boolean().optional(),
  limit: suggestionLimit,
});

export const searchGuidesSchema = z.object({
  query: z.string().trim().optional(),
  language: optionalLanguage,
  topic: z.string().trim().optional(),
  limit: searchLimit,
  offset,
});
