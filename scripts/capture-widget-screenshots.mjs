import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { once } from "node:events";

import { chromium } from "@playwright/test";

const root = resolve(import.meta.dirname, "..");
const artifact = resolve(root, "dist/widget/habitat-explorer.v4.html");
const outputDirectory = resolve(root, "docs/assets/chatgpt-screenshots");
const html = await readFile(artifact);
await mkdir(outputDirectory, { recursive: true });

const fixtures = {
  results: {
    tool: "search_fish",
    data: {
      results: [
        {
          common_name: "Neon tetra",
          scientific_name: "Paracheirodon innesi",
          slug: "paracheirodon-innesi",
          summary: "A peaceful schooling fish for stable, planted freshwater communities.",
          min_tank_liters: 60,
          temperature_range: { min: 20, max: 26, unit: "°C" },
          ph_range: { min: 4.5, max: 7.5 },
          care_level: "Easy",
          public_url: "https://atlarium.bio/en/catalog/fish/paracheirodon-innesi",
        },
        {
          common_name: "Harlequin rasbora",
          scientific_name: "Trigonostigma heteromorpha",
          slug: "trigonostigma-heteromorpha",
          summary: "A calm shoaling fish that thrives around plants and subdued light.",
          min_tank_liters: 60,
          temperature_range: { min: 22, max: 27, unit: "°C" },
          ph_range: { min: 6, max: 7.5 },
          care_level: "Easy",
          public_url: "https://atlarium.bio/en/catalog/fish/trigonostigma-heteromorpha",
        },
        {
          common_name: "Peppered corydoras",
          scientific_name: "Corydoras paleatus",
          slug: "corydoras-paleatus",
          summary: "A social bottom-dweller that needs a group and a gentle substrate.",
          min_tank_liters: 80,
          temperature_range: { min: 20, max: 25, unit: "°C" },
          ph_range: { min: 6, max: 7.6 },
          care_level: "Easy",
          public_url: "https://atlarium.bio/en/catalog/fish/corydoras-paleatus",
        },
      ],
    },
  },
  resultsIt: {
    tool: "search_fish",
    data: {
      language_used: "it",
      results: [
        { common_name: "Tetra neon", scientific_name: "Paracheirodon innesi", slug: "paracheirodon-innesi", summary: "Pesce pacifico di branco adatto ad acquari d'acqua dolce stabili e piantumati.", min_tank_liters: 60, temperature_range: { min: 20, max: 26, unit: "°C" }, ph_range: { min: 4.5, max: 7.5 }, care_level: "EASY", public_url: "https://atlarium.bio/it/catalog/fish/paracheirodon-innesi" },
        { common_name: "Rasbora arlecchino", scientific_name: "Trigonostigma heteromorpha", slug: "trigonostigma-heteromorpha", summary: "Pesce tranquillo di branco che vive bene tra piante e luce soffusa.", min_tank_liters: 60, temperature_range: { min: 22, max: 27, unit: "°C" }, ph_range: { min: 6, max: 7.5 }, care_level: "EASY", public_url: "https://atlarium.bio/it/catalog/fish/trigonostigma-heteromorpha" },
        { common_name: "Corydoras punteggiato", scientific_name: "Corydoras paleatus", slug: "corydoras-paleatus", summary: "Pesce sociale da fondo che richiede un gruppo e un substrato delicato.", min_tank_liters: 80, temperature_range: { min: 20, max: 25, unit: "°C" }, ph_range: { min: 6, max: 7.6 }, care_level: "EASY", public_url: "https://atlarium.bio/it/catalog/fish/corydoras-paleatus" },
      ],
    },
  },
  profile: {
    tool: "get_fish_profile",
    language: "it",
    data: {
      common_name: "Tetra neon",
      scientific_name: "Paracheirodon innesi",
      slug: "paracheirodon-innesi",
      summary: "Origine geografica e biotopo: Piccolo caracide dell'alta Amazzonia, legato ad affluenti ombreggiati con acqua tenera e stabile. Tassonomia e morfologia: Il corpo è minuto e fusiforme, attraversato dall'iconica banda blu iridescente. Comportamento sociale: Specie pacifica da mantenere in un gruppo numeroso all'interno di un acquario maturo e piantumato.",
      min_tank_liters: 60,
      temperature_range: { min: 20, max: 26, unit: "°C" },
      ph_range: { min: 4.5, max: 7.5 },
      gh_range: { min: 1, max: 8 },
      care_level: "Facile",
      public_url: "https://atlarium.bio/it/catalog/fish/paracheirodon-innesi",
    },
  },
  plantProfile: {
    tool: "get_plant_profile",
    language: "es",
    data: {
      common_name: "Anubias de hoja ancha",
      scientific_name: "Anubias barteri",
      slug: "anubias-barteri",
      summary: "Origen y hábitat: Planta ribereña de África occidental que prospera con el rizoma fuera del sustrato. Crecimiento y forma: Produce hojas firmes de crecimiento lento y funciona bien sobre troncos o rocas. Cuidados: Tolera luz baja y no necesita inyección de CO₂, por lo que es adecuada para principiantes.",
      temperature_range: { min: 20, max: 28, unit: "°C" },
      ph_range: { min: 5.5, max: 8 },
      gh_range: { min: 2, max: 15 },
      care_level: "Fácil",
      public_url: "https://atlarium.bio/es/catalog/plants/anubias-barteri",
    },
  },
  productSearch: {
    tool: "search_products",
    data: {
      results: [
        {
          id: "cmqer14a328nv01oywinjbm73",
          slug: "equipment/filter/amtra/filpo-click-200",
          name: "Filpo Click 200",
          brand: "Amtra",
          category: "Filter",
          short_description: "Amtra Filpo Click 200 is a compact internal filter ideal for nano aquariums up to 30 liters. The innovative Click cartridge system allows replacing filter media in a few seconds.",
          use_cases: ["FILTER", "INTERNAL"],
          public_url: "https://atlarium.bio/en/guide/products/equipment/filter/amtra/filpo-click-200",
        },
        {
          id: "cmqer1mq82ger01oyh3i9dj4i",
          slug: "equipment/filter/amtra/amtra-filpo-click-250",
          name: "Filpo Click 250",
          brand: "Amtra",
          category: "Filter",
          short_description: "The Amtra Filpo Click 250 internal filter features a click-in cartridge system, adjustable flow and included biological and carbon media.",
          use_cases: ["FILTER", "INTERNAL"],
          public_url: "https://atlarium.bio/en/guide/products/equipment/filter/amtra/amtra-filpo-click-250",
        },
      ],
      total: 843,
      limit: 2,
      offset: 0,
      has_more: true,
    },
  },
  categoryList: {
    tool: "list_product_categories",
    data: {
      categories: [
        { key: "equipment-filter", slug: "filter", name: "Filter", description: "Mechanical, biological and chemical filtration equipment for freshwater and marine aquariums.", updatedAt: "2026-08-16T17:00:57.157Z", brandCount: 24, productCount: 173, type: "EQUIPMENT" },
        { key: "fertilizer-macro", slug: "macro", name: "Macronutrients", description: "Nitrogen, phosphorus and potassium fertilizers for planted aquariums.", updatedAt: "2026-08-16T17:00:55.580Z", brandCount: 15, productCount: 68, type: "FERTILIZER" },
      ],
      language_used: "en",
    },
  },
  brandList: {
    tool: "list_product_brands",
    data: {
      brands: [
        { slug: "amtra", name: "Amtra", domain: "amtra.de", website: "https://amtra.de", country: "Germany", legalName: "Amtra Croci GmbH", foundedYear: 1986, headquarters: "Rodgau, Germany", description: "Aquarium equipment and water-care products for freshwater and marine systems.", specialization: "Aquarium equipment", hasFertilizers: false, hasEquipment: true, public_url: "https://atlarium.bio/en/guide/products/brands/amtra" },
        { slug: "seachem", name: "Seachem", domain: "seachem.com", website: "https://www.seachem.com", country: "United States", legalName: "Seachem Laboratories, Inc.", foundedYear: 1980, headquarters: "Madison, Georgia", description: "Specialist manufacturer of aquarium water treatments, filtration media and planted-tank fertilizers.", specialization: "Water care and fertilizers", hasFertilizers: true, hasEquipment: true, public_url: "https://atlarium.bio/en/guide/products/brands/seachem" },
      ],
      language_used: "en",
    },
  },
  equipmentSearch: {
    tool: "search_equipment",
    data: {
      results: [
        {
          slug: "equipment/filter/amtra/filpo-click-200",
          name: "Filpo Click 200",
          brand: "Amtra",
          category_slug: "filter",
          description: "Amtra Filpo Click 200 is a compact internal filter ideal for nano aquariums up to 30 liters. The innovative Click cartridge system allows replacing filter media in a few seconds.",
          specs: { subType: "INTERNAL", flowRateLitersHour: 200 },
          estimated_price: 55.9,
          image_url: "/media/catalog/equipment/amtra/filpo-click-200/01.jpg",
          public_url: "https://atlarium.bio/en/guide/products/equipment/filter/amtra/filpo-click-200",
          last_updated: "2026-08-16T17:00:57.157Z",
          language_used: "en",
        },
      ],
      total: 843,
      limit: 1,
      offset: 0,
      has_more: true,
    },
  },
  productProfile: {
    tool: "get_product_profile",
    data: {
      id: "cmqer13ws28if01oy30bdk27p",
      slug: "fertilizer/macro/seachem/flourish-nitrogen",
      name: "Flourish Nitrogen",
      brand: "Seachem",
      category: "Macronutrients",
      description: "Seachem Flourish Nitrogen is a concentrated blend of nitrogen sources that helps resolve nitrogen deficiencies in planted aquariums.",
      use_cases: ["MACRO", "LIQUID"],
      dosage_information: {
        recommended_ml_per_100_l: 1.5,
        frequency_hint: "once_or_twice_weekly",
      },
      compatibility_notes: null,
      warnings: [],
      public_url: "https://atlarium.bio/en/guide/products/fertilizers/macro/seachem/flourish-nitrogen",
      related_products: [],
      related_guides: [{
        slug: "products/fertilizers/macro",
        public_url: "https://atlarium.bio/en/guide/products/fertilizers/macro",
      }],
      last_updated: "2026-08-16T17:00:55.580Z",
      language_used: "en",
    },
  },
  equipmentProfile: {
    tool: "get_equipment_profile",
    data: {
      slug: "equipment/filter/amtra/filpo-click-200",
      name: "Filpo Click 200",
      brand: "Amtra",
      category_slug: "filter",
      description: "Amtra Filpo Click 200 is a compact internal filter ideal for nano aquariums up to 30 liters. The innovative Click cartridge system allows replacing filter media in a few seconds.",
      specs: { subType: "INTERNAL", flowRateLitersHour: 200 },
      estimated_price: 55.9,
      image_url: "/media/catalog/equipment/amtra/filpo-click-200/01.jpg",
      public_url: "https://atlarium.bio/en/guide/products/equipment/filter/amtra/filpo-click-200",
      last_updated: "2026-08-16T17:00:57.157Z",
      language_used: "en",
    },
  },
  fertilizerProfile: {
    tool: "get_fertilizer_profile",
    data: {
      slug: "fertilizer/macro/seachem/flourish-nitrogen",
      name: "Flourish Nitrogen",
      brand: "Seachem",
      category_slug: "macro",
      description: "Seachem Flourish Nitrogen is a concentrated blend of nitrogen sources that helps resolve nitrogen deficiencies in planted aquariums.",
      method: "LIQUID",
      recommended_ml_per_100_l: 1.5,
      frequency_hint: "once_or_twice_weekly",
      contains_macros: true,
      contains_micros: false,
      nutrients: { nitrogenMgPerMl: 15 },
      image_url: "/media/catalog/fertilizers/seachem/flourish-nitrogen/01.webp",
      public_url: "https://atlarium.bio/en/guide/products/fertilizers/macro/seachem/flourish-nitrogen",
      last_updated: "2026-08-16T17:00:55.580Z",
      language_used: "en",
    },
  },
  compatibility: {
    tool: "check_species_compatibility",
    data: {
      compatibility_level: "compatible_with_caution",
      summary: "Based on available Atlarium data, compatibility depends on tank size, behavior, water parameters and individual conditions.",
      parameter_mismatches: ["Peppered corydoras: temperature 25 is outside 20-24."],
      warnings: ["Betta splendens may require careful tankmate verification."],
      recommended_actions: ["Verify adult size, group size, behavior and water parameters before stocking.", "Introduce species gradually and monitor stress or aggression."],
      disclaimer: "Compatibility is advisory and individual behavior can vary.",
      language_used: "en",
      species_profiles: [
        { common_name: "Betta splendens", scientific_name: "Betta splendens", slug: "betta-splendens", public_url: "https://atlarium.bio/en/catalog/fish/betta-splendens", min_tank_liters: 40, temperature_range: { min: 24, max: 28, unit: "°C" } },
        { common_name: "Peppered corydoras", scientific_name: "Corydoras paleatus", slug: "corydoras-paleatus", public_url: "https://atlarium.bio/en/catalog/fish/corydoras-paleatus", min_tank_liters: 80, temperature_range: { min: 20, max: 25, unit: "°C" } },
      ],
    },
  },
  compatibilityIt: {
    tool: "check_species_compatibility",
    data: {
      compatibility_level: "compatible_with_caution",
      summary: "Based on available Atlarium data, compatibility depends on tank size, behavior, water parameters and individual conditions.",
      parameter_mismatches: ["Betta combattente: pH 8 is outside 6-7.5."],
      warnings: ["Corydoras punteggiato may require careful tankmate verification."],
      recommended_actions: ["Verify adult size, group size, behavior and water parameters before stocking.", "Introduce species gradually and monitor stress or aggression."],
      species_profiles: [
        { common_name: "Betta combattente", scientific_name: "Betta splendens", slug: "betta-splendens", public_url: "https://atlarium.bio/it/catalog/fish/betta-splendens", min_tank_liters: 40, temperature_range: { min: 24, max: 28, unit: "°C" } },
        { common_name: "Corydoras punteggiato", scientific_name: "Corydoras paleatus", slug: "corydoras-paleatus", public_url: "https://atlarium.bio/it/catalog/fish/corydoras-paleatus", min_tank_liters: 80, temperature_range: { min: 20, max: 25, unit: "°C" } },
      ],
      language_used: "it",
    },
  },
  suggestions: {
    tool: "suggest_species_for_tank",
    data: {
      suggestions: [
        { common_name: "Harlequin rasbora", scientific_name: "Trigonostigma heteromorpha", slug: "trigonostigma-heteromorpha", public_url: "https://atlarium.bio/en/catalog/fish/trigonostigma-heteromorpha", reason: "Peaceful school; compatible temperature; suitable for a planted 90 L tank", min_tank_liters: 60, care_level: "Easy" },
        { common_name: "Cardinal tetra", scientific_name: "Paracheirodon axelrodi", slug: "paracheirodon-axelrodi", public_url: "https://atlarium.bio/en/catalog/fish/paracheirodon-axelrodi", reason: "Calm midwater school; suitable pH range", min_tank_liters: 70, care_level: "Intermediate" },
        { common_name: "Peppered corydoras", scientific_name: "Corydoras paleatus", slug: "corydoras-paleatus", public_url: "https://atlarium.bio/en/catalog/fish/corydoras-paleatus", reason: "Social bottom group; gentle community behavior", min_tank_liters: 80, care_level: "Easy" },
      ],
    },
  },
  calculator: {
    tool: "calculate_tank_volume",
    data: {
      result: {
        baseAreaCm2: 1800,
        footprintM2: 0.18,
        freeboardCm: 2,
        frontAreaCm2: 2160,
        grossLiters: 64.8,
        hasRequiredDimensions: true,
        netLiters: 55.1,
        sideAreaCm2: 1080,
        waterHeightCm: 34,
        waterWeightKg: 55.1,
      },
      disclaimer: "The net value is an estimate; substrate, hardscape and fill height change the real volume.",
    },
  },
  tankWeight: {
    tool: "calculate_tank_weight",
    data: {
      result: {
        footprintM2: 0.18,
        hasRequiredDimensions: true,
        netLiters: 55.1,
        waterWeightKg: 55.1,
        glassWeightKg: 12.4,
        substrateWeightKg: 13.5,
        hardscapeWeightKg: 9,
        equipmentWeightKg: 4,
        substrateVolumeLiters: 9,
        totalWeightKg: 94,
      },
      disclaimer: "Backend disclaimer intentionally ignored by the localized widget.",
    },
  },
  waterChange: {
    tool: "calculate_water_change",
    data: {
      result: {
        dilutionFactor: 0.7,
        litersPerChange: 36,
        removedAfterChangesPercent: 51,
        remainingAfterChangesPercent: 49,
        weeklyLiters: 72,
      },
      disclaimer: "Backend disclaimer intentionally ignored by the localized widget.",
    },
  },
  waterChemistry: {
    tool: "calculate_water_chemistry",
    data: {
      co2: { co2MgPerLiter: 23.8, status: "safe" },
      general_hardness: { dgh: 8, fh: 14.29, mmol: 1.4264, ppm: 142.8 },
      carbonate_hardness: { dkh: 5, fh: 8.93, meq: 1.783, ppm: 89.2 },
      water_mix: { source1Liters: 48, source1Percent: 40, source2Liters: 72, source2Percent: 60, valid: true },
      salinity: { conductivityMsCm: 45, densityGcm3: 1.024, saltToAddGrams: 1200, specificGravity: 1.024 },
      disclaimer: "Backend disclaimer intentionally ignored by the localized widget.",
    },
  },
  unitConversion: {
    tool: "convert_units",
    data: {
      temperature: { celsius: 25, fahrenheit: 77, kelvin: 298.15 },
      temperature_delta: 4,
      length: { centimeters: 60, feet: 1.969, inches: 23.622, millimeters: 600 },
      weight: { grams: 100000, kilograms: 100, ounces: 3527.4, pounds: 220.462 },
      volume: { fluidOunces: 4057.7, gallonsUk: 26.4, gallonsUs: 31.7, liters: 120, milliliters: 120000 },
    },
  },
  equipmentRequirements: {
    tool: "calculate_equipment_requirements",
    data: {
      heater: { deltaC: 6, factor: 0.75, minimumWatts: 540, recommendedWatts: 600 },
      electricity: { dailyCost: 0.12, kwhDay: 0.4, monthlyCost: 3.6, yearlyCost: 43.8 },
      lighting: { level: "medium", lumensPerLiter: 30, wattsPerLiter: 0.3 },
      disclaimer: "Backend disclaimer intentionally ignored by the localized widget.",
    },
  },
  habitat: {
    tool: "suggest_habitat_for_tank",
    language: "it",
    data: {
      input: { volumeLiters: 120, waterType: "freshwater", temperatureC: 25, lightLevel: "medium", co2: "low", setupIntent: "community", targetDifficulty: "easy" },
      fish: [
        { slug: "trigonostigma-heteromorpha", common_name: "Rasbora arlecchino", scientific_name: "Trigonostigma heteromorpha", type: "fish", fit_status: "recommended", tier: "excellent", score: 96, reason: "waterTypeMatch; volumeMatch; groupSize: 8", warnings: [], public_url: "https://atlarium.bio/it/catalog/fish/trigonostigma-heteromorpha" },
        { slug: "corydoras-paleatus", common_name: "Corydoras maculato", scientific_name: "Corydoras paleatus", type: "fish", fit_status: "recommended", tier: "good", score: 88, reason: "waterTypeMatch; volumeMatch; groupSize: 6", warnings: ["Mantenere un fondo fine e non tagliente."], public_url: "https://atlarium.bio/it/catalog/fish/corydoras-paleatus" },
      ],
      invertebrates: [{ slug: "caridina-multidentata", common_name: "Caridina japonica", scientific_name: "Caridina multidentata", type: "invertebrate", fit_status: "review", tier: "good", score: 82, reason: "waterTypeMatch; groupSize: 6", warnings: ["Verificare la compatibilità individuale con i pesci."], public_url: "https://atlarium.bio/it/catalog/fish/caridina-multidentata" }],
      plants: [
        { slug: "anubias-barteri", common_name: "Anubias barteri", scientific_name: "Anubias barteri", type: "plant", fit_status: "recommended", tier: "excellent", score: 95, reason: "lightMatch; co2Match", warnings: [], public_url: "https://atlarium.bio/it/catalog/plants/anubias-barteri" },
        { slug: "microsorum-pteropus", common_name: "Felce di Giava", scientific_name: "Microsorum pteropus", type: "plant", fit_status: "recommended", tier: "excellent", score: 93, reason: "lightMatch; difficultyMatch", warnings: [], public_url: "https://atlarium.bio/it/catalog/plants/microsorum-pteropus" },
      ],
      products: [
        { name: "Filpo Click 200", brand: "Amtra", category: "Filter", type: "equipment", fit_status: "recommended", tier: "good", score: 86, reason: "volumeMatch; Suitable gentle circulation", warnings: [], public_url: "https://atlarium.bio/it/guide/products/equipment/filter/amtra/filpo-click-200" },
        { name: "Flourish Comprehensive", brand: "Seachem", category: "Micronutrients", type: "fertilizer", fit_status: "review", tier: "good", score: 81, reason: "fertilizerMatch; Verify dose against plant response", warnings: [], public_url: "https://atlarium.bio/it/guide/products/fertilizers/micro/seachem/flourish-comprehensive" },
      ],
      guides: [
        { slug: "cycling-a-planted-aquarium", public_url: "https://atlarium.bio/it/guide/cycling-a-planted-aquarium" },
        { slug: "managing-nitrate", public_url: "https://atlarium.bio/it/guide/managing-nitrate" },
      ],
      disclaimer: "Backend disclaimer intentionally ignored by the localized widget.",
      language_used: "it",
    },
  },
  diagnostic: {
    tool: "match_diagnostic_profiles",
    language: "it",
    data: {
      results: [{
        name: "Possibile malattia dei puntini bianchi",
        slug: "ichthyophthirius-multifiliis",
        summary: "Un profilo visivo compatibile con piccoli puntini bianchi, sfregamento e respirazione accelerata. Il risultato è orientativo e richiede una verifica diretta degli animali e dei parametri.",
        symptoms: ["Puntini bianchi su corpo e pinne", "Sfregamento contro arredi", "Respirazione più rapida"],
        likely_causes: ["Introduzione recente di animali non quarantinati", "Stress termico o parametri instabili"],
        recommended_actions: ["Isolare e osservare gli animali quando possibile", "Verificare temperatura, ammoniaca, nitriti e ossigenazione", "Confermare la diagnosi prima di qualsiasi trattamento"],
        prevention: ["Quarantena preventiva", "Stabilità dei parametri", "Attrezzatura separata per le vasche di cura"],
      }],
    },
  },
  diseaseProfile: {
    tool: "get_disease_profile",
    data: {
      slug: "black-ich",
      common_name: "Black Ich / Tang Disease",
      scientific_name: "Paravortex turbellarian infestation",
      short_description: "A marine fish disease caused by parasitic flatworms, recognized by small black spots and irritation of the skin and fins.",
      type: "disease",
      image_url: "/media/catalog/diagnostics/diseases/black-ich.png",
      public_url: "https://atlarium.bio/en/diagnostics/diseases/black-ich",
      description: "### Overview\nBlack ich is associated with small turbellarian flatworms that attach to marine fish. Tangs are frequently affected, but other species can also develop visible lesions and irritation.",
      symptoms: "### Visible signs\n- **Black spots:** Pinpoint dark marks on the body and fins.\n- **Irritation:** Flashing, scratching and increased mucus production.\n- **Advanced cases:** Reduced appetite and lethargy.",
      causes: "### Likely causes\n- Introduction of infected fish without quarantine.\n- Persistence of the parasite in a display system with suitable hosts.",
      treatments: "### Therapeutic Interventions\n1. **Freshwater dips:** Use a temperature- and pH-matched dip when appropriate for the species.\n2. **Quarantine treatment:** Move affected fish to a dedicated hospital tank.\n3. **Observation:** Monitor respiration, appetite and secondary infection risk.",
      prevention: "### Prevention\n- Quarantine new marine fish before introduction.\n- Avoid sharing wet equipment between systems.\n- Maintain stable water quality and reduce avoidable stress.",
      contagious: true,
      mortality_rate: "LOW",
      difficulty: 3,
      water_types: ["MARINE"],
      medicines: [{ slug: "praziquantel", name: "Praziquantel" }],
      disclaimer: "This information is educational and does not replace diagnosis by an aquatic veterinarian.",
    },
  },
  fertilization: {
    tool: "generate_fertilization_plan",
    language: "it",
    data: {
      preset_items: [{ brandName: "Seachem", productName: "Flourish Comprehensive", method: "LIQUID", doseValue: 2.4, doseUnit: "ml", daysOfWeek: [1, 4] }],
      weekly_totals: [{ brandName: "Seachem", productName: "Flourish Comprehensive", method: "LIQUID", doseUnit: "ml", actualWeeklyDose: 4.8, scheduledDoseCount: 2, recommendation: { minWeeklyMl: 2.4, maxWeeklyMl: 4.8 }, comparisonStatus: "in_range" }],
      coverage: { coverage: [{ key: "iron", label: "Fe", targetMgL: 0.1, weeklyMgL: 0.1067, status: "optimal" }], unknownItemCount: 0 },
      proposals: [],
      disclaimer: "Backend disclaimer intentionally ignored by the localized widget.",
    },
  },
  fertilizerDose: {
    tool: "calculate_fertilizer_dose",
    language: "es",
    data: {
      product_name: "Flourish Comprehensive",
      brand_name: "Seachem",
      volume_liters: 120,
      per_dose_ml: 2.4,
      recommendation: { minDoseCount: 1, maxDoseCount: 2, minWeeklyMl: 2.4, maxWeeklyMl: 4.8, frequencyHint: "once_or_twice_weekly" },
      specs: { method: "LIQUID", recommendedMlPer100L: 2, containsMacros: false, containsMicros: true, nutrients: { ironMgPerMl: 3.2, magnesiumMgPerMl: 0.6 } },
      disclaimer: "Backend disclaimer intentionally ignored by the localized widget.",
    },
  },
  nutrientGaps: {
    tool: "calculate_nutrient_gaps",
    data: {
      gaps: [
        { key: "nitrogen", label: "N", targetMgL: 10, currentMgL: 1.1295, deficitMgL: 8.8705, sourceKind: "NO3", status: "below" },
        { key: "iron", label: "Fe", targetMgL: 0.1, currentMgL: null, deficitMgL: null, sourceKind: "FE", status: "missing_measurement" },
      ],
      disclaimer: "Backend disclaimer intentionally ignored by the localized widget.",
    },
  },
  weeklyTotals: {
    tool: "calculate_weekly_dose_totals",
    data: {
      totals: [
        { brandName: "Seachem", productName: "Flourish Nitrogen", method: "LIQUID", doseUnit: "ml", actualWeeklyDose: 3, scheduledDoseCount: 2, recommendation: { minWeeklyMl: 1.8, maxWeeklyMl: 3.6 }, comparisonStatus: "in_range" },
        { brandName: "Seachem", productName: "Flourish Phosphorus", method: "LIQUID", doseUnit: "ml", actualWeeklyDose: 2, scheduledDoseCount: 2, recommendation: { minWeeklyMl: 3.72, maxWeeklyMl: 7.44 }, comparisonStatus: "below" },
      ],
      disclaimer: "Backend disclaimer intentionally ignored by the localized widget.",
    },
  },
  incompleteCalculator: { tool: "calculate_tank_volume", data: { result: { hasRequiredDimensions: false, grossLiters: 0, netLiters: 0 } } },
  empty: { tool: "search_fish", data: { results: [] } },
  error: { isError: true, content: [{ type: "text", text: '{"tool":"get_fish_profile","data":' }] },
};

const cases = [
  { name: "v4-search-desktop-light-en", fixture: fixtures.results, theme: "light", viewport: { width: 900, height: 720 }, expectedText: "3 public results", expectsCatalogMedia: true },
  { name: "v4-search-mobile-dark-it", fixture: fixtures.resultsIt, theme: "dark", locale: "it-IT", viewport: { width: 390, height: 844 }, expectedText: "3 risultati pubblici", forbiddenTexts: ["Easy", "A peaceful schooling fish"], expectsCatalogMedia: true },
  { name: "v4-fish-profile-inline-dark-it", fixture: fixtures.profile, theme: "dark", locale: "it-IT", viewport: { width: 900, height: 720 }, expectedText: "Origine geografica e biotopo", expectsCatalogMedia: true },
  { name: "v4-fish-profile-fullscreen-light-it", fixture: fixtures.profile, theme: "light", locale: "it-IT", displayMode: "fullscreen", viewport: { width: 1280, height: 800 }, expectedText: "Comportamento sociale", expectsCatalogMedia: true },
  { name: "v4-plant-profile-mobile-light-es", fixture: fixtures.plantProfile, theme: "light", locale: "es-ES", viewport: { width: 390, height: 844 }, expectedText: "Origen y hábitat", expectsCatalogMedia: true },
  { name: "v4-products-search-inline-light-en", fixture: fixtures.productSearch, theme: "light", viewport: { width: 900, height: 760 }, expectedText: "2 public results", expectsCatalogMedia: false, expectsBrandLogo: true },
  { name: "v4-categories-tablet-light-en", fixture: fixtures.categoryList, theme: "light", viewport: { width: 768, height: 1024 }, expectedText: "Macronutrients", expectsCatalogMedia: false, expectsBrandLogo: false },
  { name: "v4-brands-inline-dark-en", fixture: fixtures.brandList, theme: "dark", viewport: { width: 900, height: 760 }, expectedText: "Seachem", expectsCatalogMedia: false, expectsBrandLogo: true },
  { name: "v4-equipment-search-mobile-dark-en", fixture: fixtures.equipmentSearch, theme: "dark", viewport: { width: 390, height: 844 }, expectedText: "Filpo Click 200", expectsCatalogMedia: true, expectsBrandLogo: true },
  { name: "v4-product-profile-inline-dark-en", fixture: fixtures.productProfile, theme: "dark", viewport: { width: 900, height: 720 }, expectedText: "Flourish Nitrogen", expectsCatalogMedia: false, expectsBrandLogo: true },
  { name: "v4-equipment-profile-inline-light-en", fixture: fixtures.equipmentProfile, theme: "light", viewport: { width: 900, height: 760 }, expectedText: "Filpo Click 200", expectsCatalogMedia: true, expectsBrandLogo: true },
  { name: "v4-fertilizer-profile-fullscreen-dark-en", fixture: fixtures.fertilizerProfile, theme: "dark", displayMode: "fullscreen", viewport: { width: 1280, height: 800 }, expectedText: "Flourish Nitrogen", expectsCatalogMedia: true, expectsBrandLogo: true },
  { name: "v4-compatibility-inline-light-en", fixture: fixtures.compatibility, theme: "light", viewport: { width: 900, height: 760 }, expectedText: "Compatible with caution", forbiddenText: "Compatibility is advisory and individual behavior can vary.", expectsCatalogMedia: true },
  { name: "v4-compatibility-fullscreen-dark-en", fixture: fixtures.compatibility, theme: "dark", displayMode: "fullscreen", viewport: { width: 1280, height: 800 }, expectedText: "Recommended actions", expectsCatalogMedia: true },
  { name: "v4-compatibility-inline-dark-it", fixture: fixtures.compatibilityIt, theme: "dark", locale: "it-IT", viewport: { width: 900, height: 760 }, expectedText: "Inserisci le specie gradualmente", forbiddenTexts: ["may require careful tankmate verification", "is outside"], expectsCatalogMedia: true },
  { name: "v4-suggestions-mobile-dark-en", fixture: fixtures.suggestions, theme: "dark", viewport: { width: 390, height: 844 }, expectedText: "Recommended species", expectsCatalogMedia: true },
  { name: "v4-habitat-inline-light-it", fixture: fixtures.habitat, theme: "light", locale: "it-IT", viewport: { width: 900, height: 760 }, expectedText: "Animali", forbiddenTexts: ["Backend disclaimer intentionally ignored", "Suitable Gentle Circulation", "Verify Dose Against Plant Response", "Cycling A Planted Aquarium", "Managing Nitrate"], expectsCatalogMedia: true, expectsBrandLogo: true },
  { name: "v4-habitat-fullscreen-dark-it", fixture: fixtures.habitat, theme: "dark", locale: "it-IT", displayMode: "fullscreen", viewport: { width: 1280, height: 800 }, expectedText: "Attrezzatura e prodotti", expectsCatalogMedia: true, expectsBrandLogo: true },
  { name: "v4-diagnostic-inline-light-it", fixture: fixtures.diagnostic, theme: "light", locale: "it-IT", viewport: { width: 900, height: 760 }, expectedText: "Possibile malattia dei puntini bianchi" },
  { name: "v4-diagnostic-fullscreen-dark-it", fixture: fixtures.diagnostic, theme: "dark", locale: "it-IT", displayMode: "fullscreen", viewport: { width: 1280, height: 800 }, expectedText: "Cause probabili" },
  { name: "v4-disease-profile-fullscreen-dark-en", fixture: fixtures.diseaseProfile, theme: "dark", displayMode: "fullscreen", viewport: { width: 1440, height: 900 }, expectedText: "Therapeutic Interventions", expectsCatalogMedia: true },
  { name: "v4-fertilization-plan-inline-dark-it", fixture: fixtures.fertilization, theme: "dark", locale: "it-IT", viewport: { width: 900, height: 720 }, expectedText: "Piano di fertilizzazione", forbiddenTexts: ["LIQUID", "/week"] },
  { name: "v4-fertilizer-dose-mobile-light-es", fixture: fixtures.fertilizerDose, theme: "light", locale: "es-ES", viewport: { width: 390, height: 844 }, expectedText: "Dosis por aplicación", forbiddenTexts: ["LIQUID", "Iron", "/week"] },
  { name: "v4-nutrient-gaps-fullscreen-dark-en", fixture: fixtures.nutrientGaps, theme: "dark", displayMode: "fullscreen", viewport: { width: 1280, height: 800 }, expectedText: "Target comparison" },
  { name: "v4-weekly-dose-totals-inline-light-en", fixture: fixtures.weeklyTotals, theme: "light", viewport: { width: 900, height: 760 }, expectedText: "Flourish Phosphorus" },
  { name: "v4-calculator-mobile-light-en", fixture: fixtures.calculator, theme: "light", viewport: { width: 360, height: 800 }, expectedText: "Gross volume" },
  { name: "v4-tank-weight-inline-dark-it", fixture: fixtures.tankWeight, theme: "dark", locale: "it-IT", viewport: { width: 900, height: 760 }, expectedText: "Peso totale" },
  { name: "v4-water-change-mobile-dark-es", fixture: fixtures.waterChange, theme: "dark", locale: "es-ES", viewport: { width: 390, height: 844 }, expectedText: "Por cambio" },
  { name: "v4-water-chemistry-fullscreen-light-en", fixture: fixtures.waterChemistry, theme: "light", displayMode: "fullscreen", viewport: { width: 1280, height: 800 }, expectedText: "Specific gravity" },
  { name: "v4-unit-conversion-inline-light-it", fixture: fixtures.unitConversion, theme: "light", locale: "it-IT", viewport: { width: 900, height: 760 }, expectedText: "Conversione delle unità", forbiddenTexts: ["Length", "Inches", "Feet", "Fluid ounces"] },
  { name: "v4-equipment-requirements-fullscreen-dark-es", fixture: fixtures.equipmentRequirements, theme: "dark", locale: "es-ES", displayMode: "fullscreen", viewport: { width: 1280, height: 800 }, expectedText: "Potencia recomendada del calentador", forbiddenTexts: ["Level"] },
  { name: "v4-calculator-incomplete-inline-light-it", fixture: fixtures.incompleteCalculator, theme: "light", locale: "it-IT", viewport: { width: 900, height: 720 }, expectedText: "Il calcolo richiede", expectsMascot: true },
  { name: "v4-loading-mobile-dark-es", fixture: undefined, theme: "dark", locale: "es-ES", viewport: { width: 390, height: 844 }, expectedText: "Preparando la vista del hábitat", expectedMascotLabel: "El pez azul, guía de Atlarium", expectsMascot: true },
  { name: "v4-empty-inline-light-en", fixture: fixtures.empty, theme: "light", viewport: { width: 900, height: 720 }, expectedText: "No habitat data to show", expectsMascot: true },
  { name: "v4-error-inline-dark-it", fixture: fixtures.error, theme: "dark", locale: "it-IT", viewport: { width: 900, height: 720 }, expectedText: "Impossibile visualizzare il risultato", expectsMascot: true },
];

const reviewSheets = [
  {
    name: "v4-review-desktop-contact-sheet",
    cases: cases.filter((item) => item.viewport.width >= 700),
    columns: 2,
    viewportWidth: 1680,
  },
  {
    name: "v4-review-mobile-contact-sheet",
    cases: cases.filter((item) => item.viewport.width < 700),
    columns: 3,
    viewportWidth: 1120,
  },
];

const server = createServer((_request, response) => {
  response.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(html);
});
server.listen(0, "127.0.0.1");
await once(server, "listening");
const address = server.address();
if (!address || typeof address === "string") throw new Error("Widget preview server did not bind.");
const url = `http://127.0.0.1:${address.port}`;

const browser = await chromium.launch({ headless: true });
try {
  for (const item of cases) {
    const context = await browser.newContext({ viewport: item.viewport, colorScheme: item.theme });
    await context.addInitScript(
      ({ fixture, theme, locale, displayMode }) => {
        const host = {
          toolOutput: fixture,
          theme,
          locale,
          displayMode,
          maxHeight: window.innerHeight,
          safeArea: { insets: { top: 0, right: 0, bottom: 0, left: 0 } },
          widgetState: {},
          notifiedHeights: [],
          setWidgetState(nextState) { host.widgetState = nextState; },
          async callTool() { return undefined; },
          async sendFollowUpMessage() {},
          async requestDisplayMode({ mode }) {
            host.displayMode = mode;
            window.dispatchEvent(new CustomEvent("openai:set_globals", { detail: { globals: { displayMode: mode } } }));
          },
          notifyIntrinsicHeight(height) { host.notifiedHeights.push(height); },
        };
        window.openai = host;
      },
      {
        fixture: item.fixture,
        theme: item.theme,
        locale: item.locale ?? "en-US",
        displayMode: item.displayMode ?? "inline",
      },
    );
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.locator("main").waitFor();

    if (item.expectedText) {
      await page.getByText(item.expectedText, { exact: false }).first().waitFor();
    }
    const forbiddenTexts = [item.forbiddenText, ...(item.forbiddenTexts ?? [])].filter(Boolean);
    for (const forbiddenText of forbiddenTexts) {
      if (await page.getByText(forbiddenText, { exact: true }).count()) {
        const matches = await page.getByText(forbiddenText, { exact: true }).allTextContents();
        throw new Error(`${item.name} exposes unlocalized backend copy: ${forbiddenText} (${matches.join(" | ")})`);
      }
    }
    if (item.expectedMascotLabel) {
      const mascotLabel = await page.locator("[data-mascot-accent]").getAttribute("aria-label");
      if (mascotLabel !== item.expectedMascotLabel) {
        throw new Error(`${item.name} has unexpected mascot label: ${mascotLabel ?? "missing"}`);
      }
    }

    const focusableCount = await page.locator('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])').count();
    if (focusableCount > 0) {
      await page.keyboard.press("Tab");
      const focusState = await page.evaluate(() => {
        const active = document.activeElement;
        return {
          reachedControl: active instanceof HTMLElement && active !== document.body,
          focusVisible: active instanceof HTMLElement && active.matches(":focus-visible"),
        };
      });
      if (!focusState.reachedControl || !focusState.focusVisible) {
        throw new Error(`${item.name} does not expose a keyboard-reachable visible focus state.`);
      }
      await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined));
    }

    const contrastReport = await page.locator([
      "h1",
      "h2",
      "h3",
      ".lede",
      ".result-copy strong",
      ".result-copy > span",
      ".diagnostic-block p",
      ".diagnostic-block li",
      ".notice-list li",
      ".metric dd",
      ".state-copy p",
    ].join(", ")).evaluateAll((elements, fallbackRgb) => {
      const parseColor = (value) => {
        const parts = value.match(/[\d.]+/g)?.map(Number) ?? [];
        return parts.length >= 3 ? [parts[0], parts[1], parts[2], parts[3] ?? 1] : undefined;
      };
      const over = (front, back) => {
        const alpha = front[3] + back[3] * (1 - front[3]);
        if (alpha === 0) return [0, 0, 0, 0];
        return [
          (front[0] * front[3] + back[0] * back[3] * (1 - front[3])) / alpha,
          (front[1] * front[3] + back[1] * back[3] * (1 - front[3])) / alpha,
          (front[2] * front[3] + back[2] * back[3] * (1 - front[3])) / alpha,
          alpha,
        ];
      };
      const luminance = (color) => {
        const channels = color.slice(0, 3).map((channel) => {
          const normalized = channel / 255;
          return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
        });
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
      };
      const failures = [];
      let checked = 0;
      for (const element of elements) {
        if (!(element instanceof HTMLElement) || !element.innerText.trim() || element.getClientRects().length === 0) continue;
        const style = getComputedStyle(element);
        const foreground = parseColor(style.color);
        if (!foreground) continue;
        const layers = [];
        for (let node = element; node instanceof HTMLElement; node = node.parentElement) {
          const background = parseColor(getComputedStyle(node).backgroundColor);
          if (background && background[3] > 0) layers.push(background);
        }
        let background = [...fallbackRgb, 1];
        for (let index = layers.length - 1; index >= 0; index -= 1) background = over(layers[index], background);
        const renderedForeground = over(foreground, background);
        const light = Math.max(luminance(renderedForeground), luminance(background));
        const dark = Math.min(luminance(renderedForeground), luminance(background));
        const ratio = (light + 0.05) / (dark + 0.05);
        const fontSize = Number.parseFloat(style.fontSize);
        const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
        const minimum = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700) ? 3 : 4.5;
        checked += 1;
        if (ratio + 0.01 < minimum) failures.push(`${element.tagName.toLowerCase()}:${ratio.toFixed(2)}`);
      }
      return { checked, failures };
    }, item.theme === "dark" ? [32, 32, 32] : [255, 255, 255]);
    if (contrastReport.checked === 0) throw new Error(`${item.name} did not expose any main text for contrast validation.`);
    if (contrastReport.failures.length) {
      throw new Error(`${item.name} fails WCAG AA contrast checks: ${contrastReport.failures.slice(0, 6).join(", ")}`);
    }

    const mascotCount = await page.locator("[data-mascot-accent]").count();
    if (item.expectsMascot && mascotCount === 0) {
      throw new Error(`${item.name} is missing its compact editorial mascot accent.`);
    }
    if (!item.expectsMascot && mascotCount > 0) {
      throw new Error(`${item.name} incorrectly uses the mascot as result media.`);
    }

    if (typeof item.expectsCatalogMedia === "boolean") {
      const catalogMedia = page.locator('img[src*="/api/img/"]:not([alt$=" logo"])');
      const catalogMediaCount = await catalogMedia.count();
      if (!item.expectsCatalogMedia && catalogMediaCount > 0) {
        throw new Error(`${item.name} invented catalog media that is absent from the production-shaped payload.`);
      }
      if (item.expectsCatalogMedia) {
        if (catalogMediaCount === 0) {
          throw new Error(`${item.name} is missing catalog media supplied by the production-shaped payload.`);
        }
        const loaded = await catalogMedia.evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        );
        if (!loaded) throw new Error(`${item.name} did not load all expected catalog media.`);
      }
    }

    if (typeof item.expectsBrandLogo === "boolean") {
      const brandLogos = page.locator('.brand-lockup img[alt$=" logo"]');
      const brandLogoCount = await brandLogos.count();
      if (!item.expectsBrandLogo && brandLogoCount > 0) {
        throw new Error(`${item.name} contains an unexpected manufacturer logo.`);
      }
      if (item.expectsBrandLogo) {
        if (brandLogoCount === 0) {
          throw new Error(`${item.name} is missing its manufacturer logo.`);
        }
        const loaded = await brandLogos.evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        );
        if (!loaded) throw new Error(`${item.name} did not load all expected manufacturer logos.`);
      }
    }

    const imagesWithoutAlt = await page.locator("img").evaluateAll((images) =>
      images.filter((image) => image.getAttribute("alt") === null).length,
    );
    if (imagesWithoutAlt > 0) throw new Error(`${item.name} contains images without alt text.`);
    const invalidDecorativeImages = await page.locator('[data-mascot-accent] img').evaluateAll((images) =>
      images.filter((image) => image.getAttribute("alt") !== "" || image.getAttribute("aria-hidden") !== "true").length,
    );
    if (invalidDecorativeImages > 0) throw new Error(`${item.name} exposes decorative mascot images to assistive technology.`);

    const actionHeavyArticles = await page.locator("article").evaluateAll((articles) =>
      articles.filter((article) => article.querySelectorAll("button").length > 2).length,
    );
    if (actionHeavyArticles > 0) throw new Error(`${item.name} exceeds two actions in an inline result card.`);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) throw new Error(`${item.name} has horizontal page overflow.`);
    const nestedVerticalScroll = await page.evaluate(() =>
      [...document.querySelectorAll("main *")].some((element) => {
        const style = getComputedStyle(element);
        return ["auto", "scroll"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
      }),
    );
    if (nestedVerticalScroll) throw new Error(`${item.name} has nested vertical scrolling.`);

    await page.waitForFunction(() => window.openai.notifiedHeights.length > 0);
    const intrinsicHeight = await page.evaluate(() => window.openai.notifiedHeights.at(-1));
    const renderedHeight = await page.locator("main").evaluate((main) => Math.ceil(main.getBoundingClientRect().height));
    if (item.displayMode !== "fullscreen" && intrinsicHeight > renderedHeight + 1) {
      throw new Error(`${item.name} reports viewport height instead of intrinsic content height.`);
    }
    if (item.displayMode !== "fullscreen" && intrinsicHeight >= item.viewport.height && renderedHeight < item.viewport.height) {
      throw new Error(`${item.name} creates avoidable empty inline height.`);
    }

    const screenshotPath = resolve(outputDirectory, `${item.name}.png`);
    if (item.displayMode === "fullscreen") {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } else {
      await page.locator("main").screenshot({ path: screenshotPath });
    }
    await context.close();
  }

  for (const sheet of reviewSheets) {
    await captureReviewSheet(browser, sheet);
  }
} finally {
  await browser.close();
  server.close();
}

console.log(JSON.stringify({
  screenshots: [
    ...cases.map((item) => `docs/assets/chatgpt-screenshots/${item.name}.png`),
    ...reviewSheets.map((sheet) => `docs/assets/chatgpt-screenshots/${sheet.name}.png`),
  ],
}));

async function captureReviewSheet(browser, sheet) {
  const cards = await Promise.all(sheet.cases.map(async (item) => ({
    image: `data:image/png;base64,${(await readFile(resolve(outputDirectory, `${item.name}.png`))).toString("base64")}`,
    label: item.name.replace(/^v4-/, "").replaceAll("-", " "),
  })));
  const context = await browser.newContext({
    viewport: { width: sheet.viewportWidth, height: 900 },
    colorScheme: "light",
  });
  const page = await context.newPage();
  await page.setContent(`<!doctype html>
    <html><head><style>
      * { box-sizing: border-box; }
      body { background: #ffffff; color: #111827; font: 600 14px/1.35 Arial, sans-serif; margin: 0; padding: 24px; }
      main { display: grid; gap: 24px; grid-template-columns: repeat(${sheet.columns}, minmax(0, 1fr)); }
      figure { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; display: grid; gap: 10px; margin: 0; overflow: hidden; padding: 10px; }
      img { background: white; display: block; height: 520px; object-fit: contain; object-position: top center; width: 100%; }
      figcaption { letter-spacing: 0.015em; min-height: 38px; padding: 2px 4px 6px; text-transform: capitalize; }
      @media (max-width: 1200px) { img { height: 620px; } }
    </style></head><body><main>
      ${cards.map((card) => `<figure><img alt="" src="${card.image}"><figcaption>${card.label}</figcaption></figure>`).join("")}
    </main></body></html>`);
  await page.waitForFunction(() => [...document.images].every((image) => image.complete));
  await page.screenshot({ path: resolve(outputDirectory, `${sheet.name}.png`), fullPage: true });
  await context.close();
}
