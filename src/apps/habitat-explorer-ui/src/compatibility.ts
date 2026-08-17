import type { Language } from "./copy.js";

type CanonicalCompatibilityLevel =
  | "likely_compatible_based_on_available_data"
  | "compatible_with_caution"
  | "potentially_incompatible";

const compatibilityLevelLabels: Record<Language, Record<CanonicalCompatibilityLevel, string>> = {
  en: {
    likely_compatible_based_on_available_data: "Likely compatible based on available data",
    compatible_with_caution: "Compatible with caution",
    potentially_incompatible: "Potentially incompatible",
  },
  it: {
    likely_compatible_based_on_available_data: "Probabilmente compatibili in base ai dati disponibili",
    compatible_with_caution: "Compatibili con cautela",
    potentially_incompatible: "Potenzialmente incompatibili",
  },
  es: {
    likely_compatible_based_on_available_data: "Probablemente compatibles según los datos disponibles",
    compatible_with_caution: "Compatibles con precaución",
    potentially_incompatible: "Potencialmente incompatibles",
  },
};

const exactTranslations: Record<Exclude<Language, "en">, Record<string, string>> = {
  it: {
    "Based on available Atlarium data, compatibility depends on tank size, behavior, water parameters and individual conditions.":
      "In base ai dati Atlarium disponibili, la compatibilità dipende da volume della vasca, comportamento, parametri dell'acqua e condizioni dei singoli animali.",
    "Some species could not be matched in available Atlarium data.":
      "Non è stato possibile identificare alcune specie nei dati Atlarium disponibili.",
    "Verify adult size, group size, behavior and water parameters before stocking.":
      "Prima dell'inserimento, verifica dimensioni adulte, numerosità del gruppo, comportamento e parametri dell'acqua.",
    "Introduce species gradually and monitor stress or aggression.":
      "Inserisci le specie gradualmente e controlla eventuali segnali di stress o aggressività.",
  },
  es: {
    "Based on available Atlarium data, compatibility depends on tank size, behavior, water parameters and individual conditions.":
      "Según los datos disponibles de Atlarium, la compatibilidad depende del volumen del acuario, el comportamiento, los parámetros del agua y las condiciones de cada animal.",
    "Some species could not be matched in available Atlarium data.":
      "No se pudieron identificar algunas especies en los datos disponibles de Atlarium.",
    "Verify adult size, group size, behavior and water parameters before stocking.":
      "Antes de introducirlas, comprueba el tamaño adulto, el tamaño del grupo, el comportamiento y los parámetros del agua.",
    "Introduce species gradually and monitor stress or aggression.":
      "Introduce las especies gradualmente y vigila posibles señales de estrés o agresividad.",
  },
};

const parameterLabels: Record<Exclude<Language, "en">, Record<string, string>> = {
  it: { pH: "pH", GH: "GH", KH: "KH", temperature: "temperatura" },
  es: { pH: "pH", GH: "GH", KH: "KH", temperature: "temperatura" },
};

const decimalToken = String.raw`-?\d+(?:[.,]\d+)?`;
const rangeBoundToken = String.raw`(?:${decimalToken}|-)`;
const outsideRangePattern = new RegExp(
  String.raw`^(.+): (pH|GH|KH|temperature) (${decimalToken}) is outside (${rangeBoundToken}-${rangeBoundToken})\.$`,
);

function localizeTemplate(value: string, language: Exclude<Language, "en">) {
  const carefulMatch = value.match(/^(.+) may require careful tankmate verification\.$/);
  if (carefulMatch) {
    return language === "it"
      ? `${carefulMatch[1]} richiede una verifica attenta della compatibilità con gli altri animali.`
      : `${carefulMatch[1]} requiere comprobar cuidadosamente la compatibilidad con los demás animales.`;
  }

  const volumeMatch = value.match(new RegExp(String.raw`^(.+) may require at least (${decimalToken}) L\.$`));
  if (volumeMatch) {
    return language === "it"
      ? `${volumeMatch[1]} può richiedere una vasca di almeno ${volumeMatch[2]} L.`
      : `${volumeMatch[1]} puede requerir un acuario de al menos ${volumeMatch[2]} L.`;
  }

  const outsideMatch = value.match(outsideRangePattern);
  if (outsideMatch) {
    const parameter = outsideMatch[2] ?? "";
    const label = parameterLabels[language]?.[parameter] ?? parameter;
    return language === "it"
      ? `${outsideMatch[1]}: ${label} ${outsideMatch[3]} è fuori dall'intervallo ${outsideMatch[4]}.`
      : `${outsideMatch[1]}: ${label} ${outsideMatch[3]} está fuera del intervalo ${outsideMatch[4]}.`;
  }

  const overlapMatch = value.match(/^(pH|GH|KH|temperature) ranges do not clearly overlap across all selected species\.$/);
  if (overlapMatch) {
    const parameter = overlapMatch[1] ?? "";
    const label = parameterLabels[language]?.[parameter] ?? parameter;
    return language === "it"
      ? `Gli intervalli di ${label} non si sovrappongono chiaramente per tutte le specie selezionate.`
      : `Los intervalos de ${label} no se solapan claramente para todas las especies seleccionadas.`;
  }

  return value;
}

export function localizeCompatibilityText(value: string, language: Language) {
  if (language === "en") return value;
  return exactTranslations[language]?.[value] ?? localizeTemplate(value, language);
}

export function localizeCompatibilityList(values: string[], language: Language) {
  return values.map((value) => localizeCompatibilityText(value, language));
}

export function localizeCompatibilityLevel(value: string, language: Language) {
  const normalized = value.trim().toLowerCase() as CanonicalCompatibilityLevel;
  return compatibilityLevelLabels[language]?.[normalized] ?? value.replaceAll("_", " ");
}
