import { z } from "zod";

import { languageSchema } from "./schemas.js";

type PromptArgs = Record<string, unknown>;

export type PromptDefinition = {
  name: string;
  title: string;
  description: string;
  argsSchema: z.ZodRawShape;
  handler: (args: PromptArgs) => {
    description: string;
    messages: Array<{
      role: "user";
      content: { type: "text"; text: string };
    }>;
  };
};

const promptText = z.string().trim().min(1).max(500).optional();
const promptNumber = z.number().finite().positive().max(100_000).optional();

function textPrompt(description: string, text: string) {
  return {
    description,
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text,
        },
      },
    ],
  };
}

function value(args: PromptArgs, key: string) {
  const item = args[key];
  return typeof item === "string" && item.trim() ? item.trim() : null;
}

function numberValue(args: PromptArgs, key: string) {
  const item = args[key];
  return typeof item === "number" && Number.isFinite(item) ? item : null;
}

function languageLine(args: PromptArgs) {
  const language = value(args, "language");
  return language ? `Respond in ${language}.` : "Use the user's language.";
}

export const promptDefinitions: PromptDefinition[] = [
  {
    name: "atlarium_species_search",
    title: "Atlarium species search",
    description: "Guide a public search for fish, aquatic animals or plants.",
    argsSchema: {
      language: languageSchema.optional(),
      query: promptText,
    },
    handler: (args) =>
      textPrompt(
        "Search public Atlarium species data.",
        [
          languageLine(args),
          `Search Atlarium public habitat data for ${value(args, "query") ?? "the requested species or plant"}.`,
          "Use search_fish and/or search_plants first, then get_fish_profile or get_plant_profile for the best matches.",
          "Summarize care requirements, water parameters, public URLs and any uncertainty.",
        ].join("\n"),
      ),
  },
  {
    name: "atlarium_compatibility_check",
    title: "Atlarium compatibility check",
    description: "Guide a public compatibility review for species and tank parameters.",
    argsSchema: {
      language: languageSchema.optional(),
      species: promptText,
      tank_liters: promptNumber,
    },
    handler: (args) =>
      textPrompt(
        "Check public compatibility data.",
        [
          languageLine(args),
          `Review compatibility for ${value(args, "species") ?? "the requested species list"}.`,
          numberValue(args, "tank_liters")
            ? `Use tank volume ${numberValue(args, "tank_liters")} L when calling check_species_compatibility.`
            : "Ask for tank volume only if it is essential; otherwise use available public data.",
          "Use check_species_compatibility and get_water_parameters, then explain advisory risks and mismatches.",
        ].join("\n"),
      ),
  },
  {
    name: "atlarium_habitat_plan",
    title: "Atlarium habitat plan",
    description: "Guide a complete public habitat plan for a tank.",
    argsSchema: {
      language: languageSchema.optional(),
      tank_liters: promptNumber,
      intent: promptText,
    },
    handler: (args) =>
      textPrompt(
        "Plan a public habitat suggestion.",
        [
          languageLine(args),
          `Create a habitat plan for ${numberValue(args, "tank_liters") ?? "the supplied"} liters.`,
          `Intent: ${value(args, "intent") ?? "community or planted aquarium, inferred from the user"}.`,
          "Use suggest_habitat_for_tank, then cite fish, invertebrates, plants, products, warnings, motivations, related guides and the advisory disclaimer.",
        ].join("\n"),
      ),
  },
  {
    name: "atlarium_algae_diagnosis",
    title: "Atlarium algae diagnosis",
    description: "Guide public algae diagnostic lookup.",
    argsSchema: {
      language: languageSchema.optional(),
      symptoms: promptText,
    },
    handler: (args) =>
      textPrompt(
        "Look up public algae diagnostics.",
        [
          languageLine(args),
          `Search algae diagnostics for: ${value(args, "symptoms") ?? "the user's symptoms"}.`,
          "Use search_algae and get_algae_profile for likely matches; include causes, treatments, prevention and public URLs.",
          "State that this is advisory and must be checked against actual water conditions.",
        ].join("\n"),
      ),
  },
  {
    name: "atlarium_disease_diagnosis",
    title: "Atlarium disease diagnosis",
    description: "Guide public disease and medicine diagnostic lookup.",
    argsSchema: {
      language: languageSchema.optional(),
      symptoms: promptText,
    },
    handler: (args) =>
      textPrompt(
        "Look up public disease diagnostics.",
        [
          languageLine(args),
          `Search disease diagnostics for: ${value(args, "symptoms") ?? "the user's symptoms"}.`,
          "Use search_diseases, get_disease_profile and relevant search_medicines/get_medicine_profile calls.",
          "Clearly say this is not veterinary advice and urgent cases need qualified local help.",
        ].join("\n"),
      ),
  },
  {
    name: "atlarium_plant_problem_diagnosis",
    title: "Atlarium plant problem diagnosis",
    description: "Guide public aquatic plant deficiency/problem lookup.",
    argsSchema: {
      language: languageSchema.optional(),
      symptoms: promptText,
    },
    handler: (args) =>
      textPrompt(
        "Look up public plant problem diagnostics.",
        [
          languageLine(args),
          `Search plant problems for: ${value(args, "symptoms") ?? "the user's plant symptoms"}.`,
          "Use search_plant_problems, get_plant_problem_profile, search_fertilizers and fertilizer profiles where helpful.",
          "Explain likely causes, checks, treatment options and uncertainty.",
        ].join("\n"),
      ),
  },
  {
    name: "atlarium_product_selection",
    title: "Atlarium product selection",
    description: "Guide public product, equipment and fertilizer selection.",
    argsSchema: {
      language: languageSchema.optional(),
      use_case: promptText,
    },
    handler: (args) =>
      textPrompt(
        "Select public Atlarium catalog products.",
        [
          languageLine(args),
          `Find products for: ${value(args, "use_case") ?? "the user's setup or use case"}.`,
          "Use list_product_categories/list_product_brands, search_equipment, search_fertilizers and profile tools.",
          "Compare options by public specs, use case fit, warnings and public URLs without claiming endorsement.",
        ].join("\n"),
      ),
  },
  {
    name: "atlarium_fertilization_plan",
    title: "Atlarium fertilization plan",
    description: "Guide advisory fertilization calculations and plan generation.",
    argsSchema: {
      language: languageSchema.optional(),
      tank_liters: promptNumber,
      regime: promptText,
    },
    handler: (args) =>
      textPrompt(
        "Build a public advisory fertilization plan.",
        [
          languageLine(args),
          `Use tank volume ${numberValue(args, "tank_liters") ?? "provided by the user"} L.`,
          `Regime preference: ${value(args, "regime") ?? "infer or compare public regimes"}.`,
          "Use search_fertilization_regimes, calculate_fertilizer_dose, calculate_nutrient_gaps, calculate_weekly_dose_totals and generate_fertilization_plan as needed.",
          "Keep the result advisory and do not imply any plan was saved.",
        ].join("\n"),
      ),
  },
  {
    name: "atlarium_tank_calculations",
    title: "Atlarium tank calculations",
    description: "Guide public tank volume, weight, water chemistry, units and equipment calculations.",
    argsSchema: {
      language: languageSchema.optional(),
      task: promptText,
    },
    handler: (args) =>
      textPrompt(
        "Run public aquarium calculations.",
        [
          languageLine(args),
          `Calculation task: ${value(args, "task") ?? "the user's tank calculation request"}.`,
          "Use calculate_tank_volume, calculate_tank_weight, calculate_water_change, calculate_water_chemistry, convert_units or calculate_equipment_requirements.",
          "Report assumptions and advisory disclaimers for weight, equipment and chemistry outputs.",
        ].join("\n"),
      ),
  },
];
