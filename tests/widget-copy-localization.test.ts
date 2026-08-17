import { describe, expect, it } from "vitest";

import { useCopy, type Language } from "../src/apps/habitat-explorer-ui/src/copy.js";

const metricCases: Record<Exclude<Language, "en">, Record<string, string>> = {
  it: {
    Feet: "Piedi",
    "Fluid ounces": "Once liquide",
    Inches: "Pollici",
    Iron: "Ferro",
    Items: "Elementi",
    Kilograms: "Chilogrammi",
    Length: "Lunghezza",
    Level: "Livello",
    Partial: "Parziale",
    "Per week": "Alla settimana",
  },
  es: {
    Feet: "Pies",
    "Fluid ounces": "Onzas líquidas",
    Inches: "Pulgadas",
    Iron: "Hierro",
    Items: "Elementos",
    Kilograms: "Kilogramos",
    Length: "Longitud",
    Level: "Nivel",
    Partial: "Parcial",
    "Per week": "Por semana",
  },
};

const statusCases: Record<Exclude<Language, "en">, Record<string, string>> = {
  it: {
    COMPATIBLE: "Compatibili",
    COMPATIBLE_WITH_CAUTION: "Compatibili con cautela",
    "Compatible With Caution": "Compatibili con cautela",
    INCOMPATIBLE: "Non compatibili",
    EASY: "Facile",
    INTERMEDIATE: "Intermedio",
    EXPERT: "Esperto",
    BALANCED: "Bilanciato",
    DISEASE: "Malattia",
    PARASITE: "Parassitaria",
    BACTERIAL: "Batterica",
    FUNGAL: "Fungina",
    VIRAL: "Virale",
    ENVIRONMENTAL: "Ambientale",
    NUTRITIONAL_DEFICIENCY: "Carenza nutrizionale",
    FRESHWATER: "Acqua dolce",
    BRACKISH: "Acqua salmastra",
    MARINE: "Acqua marina",
    LIQUID: "Liquido",
    FILTER: "Filtro",
    INTERNAL: "Interno",
    EQUIPMENT: "Attrezzatura",
    FERTILIZER: "Fertilizzante",
    YES: "Sì",
    "Once Or Twice Weekly": "Una o due volte a settimana",
    PER_WEEK: "Alla settimana",
  },
  es: {
    COMPATIBLE: "Compatibles",
    COMPATIBLE_WITH_CAUTION: "Compatibles con precaución",
    "Compatible With Caution": "Compatibles con precaución",
    INCOMPATIBLE: "Incompatibles",
    EASY: "Fácil",
    INTERMEDIATE: "Intermedio",
    EXPERT: "Experto",
    BALANCED: "Equilibrado",
    DISEASE: "Enfermedad",
    PARASITE: "Parasitaria",
    BACTERIAL: "Bacteriana",
    FUNGAL: "Fúngica",
    VIRAL: "Vírica",
    ENVIRONMENTAL: "Ambiental",
    NUTRITIONAL_DEFICIENCY: "Deficiencia nutricional",
    FRESHWATER: "Agua dulce",
    BRACKISH: "Agua salobre",
    MARINE: "Agua marina",
    LIQUID: "Líquido",
    FILTER: "Filtro",
    INTERNAL: "Interno",
    EQUIPMENT: "Equipo",
    FERTILIZER: "Fertilizante",
    YES: "Sí",
    "Once Or Twice Weekly": "Una o dos veces por semana",
    PER_WEEK: "Por semana",
  },
};

describe("Habitat Explorer copy-table localization", () => {
  for (const language of ["it", "es"] as const) {
    it(`localizes audited calculation labels in ${language}`, () => {
      const copy = useCopy(language);
      for (const [source, expected] of Object.entries(metricCases[language])) {
        expect(copy.metricLabel(source), source).toBe(expected);
      }
    });

    it(`localizes audited atomic statuses in ${language}`, () => {
      const copy = useCopy(language);
      for (const [source, expected] of Object.entries(statusCases[language])) {
        expect(copy.statusLabel(source), source).toBe(expected);
      }
    });

    it(`localizes audited composite statuses in ${language}`, () => {
      const copy = useCopy(language);
      const expected = language === "it" ? "Filtro · Interno" : "Filtro · Interno";
      expect(copy.statusLabel("FILTER · INTERNAL")).toBe(expected);
    });
  }

  it("keeps unknown values readable instead of inventing a translation", () => {
    expect(useCopy("it").statusLabel("API_ONLY_STATUS")).toBe("API ONLY STATUS");
    expect(useCopy("es").metricLabel("API-only metric")).toBe("API-only metric");
  });
});
