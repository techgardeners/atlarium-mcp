import { describe, expect, it } from "vitest";

import {
  localizeCompatibilityLevel,
  localizeCompatibilityList,
  localizeCompatibilityText,
} from "../src/apps/habitat-explorer-ui/src/compatibility.js";

const summary =
  "Based on available Atlarium data, compatibility depends on tank size, behavior, water parameters and individual conditions.";

describe("compatibility widget localization", () => {
  it("localizes the production Italian compatibility narrative", () => {
    expect(localizeCompatibilityText(summary, "it")).toBe(
      "In base ai dati Atlarium disponibili, la compatibilità dipende da volume della vasca, comportamento, parametri dell'acqua e condizioni dei singoli animali.",
    );
    expect(
      localizeCompatibilityList(
        [
          "Corydoras punteggiato may require careful tankmate verification.",
          "Betta combattente may require at least 40 L.",
          "Betta combattente: pH 8 is outside 6-7.5.",
          "Betta combattente: temperature 18.5 is outside 24-29.5.",
          "pH ranges do not clearly overlap across all selected species.",
          "Verify adult size, group size, behavior and water parameters before stocking.",
          "Introduce species gradually and monitor stress or aggression.",
        ],
        "it",
      ),
    ).toEqual([
      "Corydoras punteggiato richiede una verifica attenta della compatibilità con gli altri animali.",
      "Betta combattente può richiedere una vasca di almeno 40 L.",
      "Betta combattente: pH 8 è fuori dall'intervallo 6-7.5.",
      "Betta combattente: temperatura 18.5 è fuori dall'intervallo 24-29.5.",
      "Gli intervalli di pH non si sovrappongono chiaramente per tutte le specie selezionate.",
      "Prima dell'inserimento, verifica dimensioni adulte, numerosità del gruppo, comportamento e parametri dell'acqua.",
      "Inserisci le specie gradualmente e controlla eventuali segnali di stress o aggressività.",
    ]);
  });

  it("localizes the equivalent Spanish compatibility narrative", () => {
    expect(localizeCompatibilityText(summary, "es")).toContain("Según los datos disponibles de Atlarium");
    expect(
      localizeCompatibilityText(
        "Betta luchador may require careful tankmate verification.",
        "es",
      ),
    ).toBe(
      "Betta luchador requiere comprobar cuidadosamente la compatibilidad con los demás animales.",
    );
    expect(
      localizeCompatibilityText(
        "Pez luchador de Siam: pH 8 is outside 6-7.5.",
        "es",
      ),
    ).toBe("Pez luchador de Siam: pH 8 está fuera del intervalo 6-7.5.");
    expect(
      localizeCompatibilityText(
        "Pez luchador de Siam: temperature 18,5 is outside 24-29,5.",
        "es",
      ),
    ).toBe("Pez luchador de Siam: temperatura 18,5 está fuera del intervalo 24-29,5.");
  });

  it.each([
    ["likely_compatible_based_on_available_data", "Likely compatible based on available data", "Probabilmente compatibili in base ai dati disponibili", "Probablemente compatibles según los datos disponibles"],
    ["compatible_with_caution", "Compatible with caution", "Compatibili con cautela", "Compatibles con precaución"],
    ["potentially_incompatible", "Potentially incompatible", "Potenzialmente incompatibili", "Potencialmente incompatibles"],
  ] as const)("localizes the canonical %s level", (level, english, italian, spanish) => {
    expect(localizeCompatibilityLevel(level, "en")).toBe(english);
    expect(localizeCompatibilityLevel(level, "it")).toBe(italian);
    expect(localizeCompatibilityLevel(level, "es")).toBe(spanish);
  });

  it("keeps English, unknown advisory text and near-miss templates unchanged", () => {
    expect(localizeCompatibilityText(summary, "en")).toBe(summary);
    expect(localizeCompatibilityText("Editorial note from the API.", "it")).toBe(
      "Editorial note from the API.",
    );
    expect(localizeCompatibilityText("Fish: pH high is outside 6-7.5.", "it")).toBe(
      "Fish: pH high is outside 6-7.5.",
    );
    expect(localizeCompatibilityText("Fish: pH 8 is outside 6 to 7.5.", "es")).toBe(
      "Fish: pH 8 is outside 6 to 7.5.",
    );
    expect(localizeCompatibilityText(" may require careful tankmate verification.", "it")).toBe(
      " may require careful tankmate verification.",
    );
    expect(localizeCompatibilityLevel("potentially_compatible", "it")).toBe(
      "potentially compatible",
    );
  });
});
