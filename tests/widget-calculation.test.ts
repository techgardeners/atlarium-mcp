import { describe, expect, it } from "vitest";

import { normalizeCalculationPresentation } from "../src/apps/habitat-explorer-ui/src/calculation.js";

describe("Habitat Explorer calculation presentation", () => {
  it("normalizes production-shaped tank volume and its incomplete state", () => {
    const ready = normalizeCalculationPresentation("calculate_tank_volume", {
      result: {
        baseAreaCm2: 1800,
        footprintM2: 0.18,
        freeboardCm: 2,
        frontAreaCm2: 2160,
        grossLiters: 64.8,
        hasRequiredDimensions: true,
        netLiters: 44.1,
        sideAreaCm2: 1080,
        waterHeightCm: 34,
        waterWeightKg: 44.1,
      },
      disclaimer: "Backend text must not be used by the normalizer.",
    });

    expect(ready).toMatchObject({
      state: "ready",
      hero: { label: "Net volume", value: 44.1, unit: "L" },
      disclaimerKind: "tank-volume",
    });
    expect(ready?.sections.map((section) => section.id)).toEqual(["dimensions", "surfaces"]);
    expect(JSON.stringify(ready)).not.toContain("Backend text");

    const incomplete = normalizeCalculationPresentation("calculate_tank_volume", {
      result: { hasRequiredDimensions: false, grossLiters: 0, netLiters: 0 },
    });
    expect(incomplete).toMatchObject({ state: "incomplete", sections: [] });
    expect(incomplete?.hero).toBeUndefined();
  });

  it("normalizes the complete tank weight breakdown", () => {
    const presentation = normalizeCalculationPresentation("calculate_tank_weight", {
      result: {
        footprintM2: 0.18,
        hasRequiredDimensions: true,
        netLiters: 44.1,
        waterWeightKg: 44.1,
        equipmentWeightKg: 4,
        glassWeightKg: 12.4,
        hardscapeWeightKg: 9,
        substrateVolumeLiters: 9,
        substrateWeightKg: 13.5,
        totalWeightKg: 83,
      },
    });

    expect(presentation).toMatchObject({
      state: "ready",
      hero: { label: "Total weight", value: 83, unit: "kg" },
      disclaimerKind: "tank-weight",
    });
    expect(presentation?.sections[0]?.metrics).toContainEqual({
      label: "Glass",
      value: 12.4,
      unit: "kg",
    });
  });

  it("normalizes water-change values and suppresses the zero-only response", () => {
    const ready = normalizeCalculationPresentation("calculate_water_change", {
      result: {
        dilutionFactor: 0.7,
        litersPerChange: 36,
        removedAfterChangesPercent: 51,
        remainingAfterChangesPercent: 49,
        weeklyLiters: 72,
      },
    });
    expect(ready).toMatchObject({
      state: "ready",
      hero: { label: "Per change", value: 36, unit: "L" },
      disclaimerKind: "water-change",
    });

    const empty = normalizeCalculationPresentation("calculate_water_change", {
      result: {
        dilutionFactor: 1,
        litersPerChange: 0,
        removedAfterChangesPercent: 0,
        remainingAfterChangesPercent: 100,
        weeklyLiters: 0,
      },
    });
    expect(empty).toMatchObject({ state: "empty", sections: [] });
  });

  it("normalizes every water chemistry section with explicit units", () => {
    const ready = normalizeCalculationPresentation("calculate_water_chemistry", {
      co2: { co2MgPerLiter: 23.8, status: "safe" },
      general_hardness: { dgh: 8, fh: 14.29, mmol: 1.4264, ppm: 142.8 },
      carbonate_hardness: { dkh: 5, fh: 8.93, meq: 1.783, ppm: 89.2 },
      water_mix: {
        source1Liters: 48,
        source1Percent: 40,
        source2Liters: 72,
        source2Percent: 60,
        valid: true,
      },
      salinity: {
        conductivityMsCm: 45,
        densityGcm3: 1.024,
        saltToAddGrams: 1200,
        specificGravity: 1.024,
      },
    });

    expect(ready).toMatchObject({
      state: "ready",
      hero: { label: "CO₂", value: 23.8, unit: "mg/L", status: "safe" },
      disclaimerKind: "water-chemistry",
    });
    expect(ready?.sections.map((section) => section.id)).toEqual([
      "co2",
      "general-hardness",
      "carbonate-hardness",
      "water-mix",
      "salinity",
    ]);
    expect(
      normalizeCalculationPresentation("calculate_water_chemistry", {
        co2: null,
        general_hardness: null,
        carbonate_hardness: null,
        water_mix: null,
        salinity: null,
      }),
    ).toMatchObject({ state: "empty", sections: [] });
  });

  it("normalizes all unit-conversion groups and the all-null response", () => {
    const ready = normalizeCalculationPresentation("convert_units", {
      temperature: { celsius: 25, fahrenheit: 77, kelvin: 298.15 },
      temperature_delta: 4,
      length: { centimeters: 60, feet: 1.969, inches: 23.622, millimeters: 600 },
      weight: { grams: 100000, kilograms: 100, ounces: 3527.4, pounds: 220.462 },
      volume: {
        fluidOunces: 4057.7,
        gallonsUk: 26.4,
        gallonsUs: 31.7,
        liters: 120,
        milliliters: 120000,
      },
    });

    expect(ready).toMatchObject({
      state: "ready",
      hero: { label: "Celsius", value: 25, unit: "°C" },
    });
    expect(ready?.sections).toHaveLength(5);
    expect(ready?.sections.map((section) => section.title)).toEqual([
      "Temperature",
      "Temperature difference",
      "Length Cm",
      "Weight",
      "Volume",
    ]);
    const empty = normalizeCalculationPresentation("convert_units", {
      temperature: null,
      temperature_delta: null,
      length: null,
      weight: null,
      volume: null,
    });
    expect(empty).toMatchObject({ state: "empty", sections: [] });
    expect(empty?.hero).toBeUndefined();
  });

  it("normalizes heater, cost and lighting requirements without inventing a currency", () => {
    const ready = normalizeCalculationPresentation("calculate_equipment_requirements", {
      heater: { deltaC: 6, factor: 0.75, minimumWatts: 540, recommendedWatts: 600 },
      electricity: { dailyCost: 0.12, kwhDay: 0.4, monthlyCost: 3.6, yearlyCost: 43.8 },
      lighting: { level: "medium", lumensPerLiter: 30, wattsPerLiter: 0.3 },
    });

    expect(ready).toMatchObject({
      state: "ready",
      hero: { label: "Recommended heater power", value: 600, unit: "W" },
      disclaimerKind: "equipment",
    });
    const electricity = ready?.sections.find((section) => section.id === "electricity");
    expect(electricity?.metrics).toContainEqual({ label: "Monthly cost", value: 3.6 });
    expect(JSON.stringify(electricity)).not.toMatch(/[€$]/);
    expect(
      normalizeCalculationPresentation("calculate_equipment_requirements", {
        heater: null,
        electricity: null,
        lighting: null,
      }),
    ).toMatchObject({ state: "empty", sections: [] });
  });

  it("normalizes a resolved fertilizer dose and distinguishes an unresolved catalog product", () => {
    const ready = normalizeCalculationPresentation("calculate_fertilizer_dose", {
      product_name: "Flourish Comprehensive",
      brand_name: "Seachem",
      volume_liters: 120,
      per_dose_ml: 2.4,
      recommendation: {
        perDoseMl: 2.4,
        minDoseCount: 1,
        maxDoseCount: 2,
        minWeeklyMl: 2.4,
        maxWeeklyMl: 4.8,
        frequencyHint: "once_or_twice_weekly",
      },
      specs: {
        method: "LIQUID",
        recommendedMlPer100L: 2,
        frequencyHint: "once_or_twice_weekly",
        containsMacros: false,
        containsMicros: true,
        nutrients: { ironMgPerMl: 3.2, magnesiumMgPerMl: 0.6 },
      },
    });

    expect(ready).toMatchObject({
      state: "ready",
      title: "Flourish Comprehensive",
      hero: { label: "Dose per application", value: 2.4, unit: "mL" },
      disclaimerKind: "fertilizer-dose",
    });
    expect(ready?.sections.find((section) => section.id === "nutrients")?.metrics).toContainEqual({
      label: "Iron",
      value: 3.2,
      unit: "mg/mL",
    });
    expect(
      ready?.sections.find((section) => section.id === "recommendation")?.metrics,
    ).toEqual(expect.arrayContaining([
      { label: "Minimum applications", value: 1 },
      { label: "Maximum applications", value: 2 },
    ]));
    expect(JSON.stringify(ready)).not.toContain('"unit":"/week"');

    const empty = normalizeCalculationPresentation("calculate_fertilizer_dose", {
      product_name: "No Such Fertilizer",
      brand_name: "No Such Brand",
      volume_liters: 120,
      per_dose_ml: null,
      recommendation: null,
      specs: null,
    });
    expect(empty).toMatchObject({
      state: "empty",
      title: "No Such Fertilizer",
      highlights: [
        { label: "Brand", value: "No Such Brand" },
        { label: "Tank volume", value: 120, unit: "L" },
      ],
    });
  });

  it("normalizes nutrient gaps and removes no-target noise", () => {
    const ready = normalizeCalculationPresentation("calculate_nutrient_gaps", {
      gaps: [
        {
          key: "nitrogen",
          label: "N",
          targetMgL: 10,
          currentMgL: 1.1295,
          deficitMgL: 8.8705,
          sourceKind: "NO3",
          status: "below",
        },
        {
          key: "iron",
          label: "Fe",
          targetMgL: 0.1,
          currentMgL: null,
          deficitMgL: null,
          sourceKind: "FE",
          status: "missing_measurement",
        },
        {
          key: "boron",
          label: "B",
          targetMgL: null,
          currentMgL: null,
          deficitMgL: null,
          sourceKind: "B",
          status: "no_target",
        },
      ],
    });

    expect(ready).toMatchObject({
      state: "ready",
      hero: { label: "Nutrients with targets", value: 2 },
      disclaimerKind: "nutrient-gaps",
    });
    expect(ready?.sections[0]?.rows).toHaveLength(2);
    expect(ready?.sections[0]?.rows?.[0]).toMatchObject({
      label: "N",
      detail: "NO3",
      status: "below",
    });

    expect(
      normalizeCalculationPresentation("calculate_nutrient_gaps", {
        gaps: [{ key: "nitrogen", label: "N", status: "no_target" }],
      }),
    ).toMatchObject({ state: "empty", sections: [] });
  });

  it("normalizes weekly dose rows and their comparison statuses", () => {
    const ready = normalizeCalculationPresentation("calculate_weekly_dose_totals", {
      totals: [
        {
          brandName: "Seachem",
          productName: "Flourish Nitrogen",
          method: "LIQUID",
          doseUnit: "ml",
          actualWeeklyDose: 3,
          scheduledDoseCount: 2,
          recommendation: { minWeeklyMl: 1.8, maxWeeklyMl: 3.6 },
          comparisonStatus: "in_range",
        },
        {
          brandName: "Seachem",
          productName: "Flourish Phosphorus",
          method: "LIQUID",
          doseUnit: "ml",
          actualWeeklyDose: 2,
          scheduledDoseCount: 2,
          recommendation: { minWeeklyMl: 3.72, maxWeeklyMl: 7.44 },
          comparisonStatus: "below",
        },
      ],
    });

    expect(ready).toMatchObject({
      state: "ready",
      hero: { label: "Products", value: 2 },
      disclaimerKind: "weekly-dose-totals",
    });
    expect(ready?.sections[0]?.rows?.map((row) => row.status)).toEqual(["in_range", "below"]);
    expect(ready?.sections[0]?.rows?.[0]).toMatchObject({
      detail: "Seachem",
      metrics: expect.arrayContaining([
        { label: "Method", value: "LIQUID" },
        { label: "Scheduled applications", value: 2 },
      ]),
    });
    expect(JSON.stringify(ready)).not.toContain("Seachem · LIQUID");
    expect(JSON.stringify(ready)).not.toContain('"unit":"/week"');
    expect(
      normalizeCalculationPresentation("calculate_weekly_dose_totals", { totals: [] }),
    ).toMatchObject({ state: "empty", sections: [] });
  });

  it("normalizes regime schedules, totals and meaningful coverage", () => {
    const ready = normalizeCalculationPresentation("generate_fertilization_plan", {
      preset_items: [
        {
          brandName: "Seachem",
          productName: "Flourish Comprehensive",
          method: "LIQUID",
          doseValue: 2.4,
          doseUnit: "ml",
          daysOfWeek: [1, 4],
        },
      ],
      weekly_totals: [
        {
          brandName: "Seachem",
          productName: "Flourish Comprehensive",
          method: "LIQUID",
          doseUnit: "ml",
          actualWeeklyDose: 4.8,
          scheduledDoseCount: 2,
          recommendation: { minWeeklyMl: 2.4, maxWeeklyMl: 4.8 },
          comparisonStatus: "in_range",
        },
      ],
      coverage: {
        coverage: [
          { key: "iron", label: "Fe", targetMgL: 0.1, weeklyMgL: 0.1067, status: "optimal" },
          { key: "boron", label: "B", targetMgL: null, weeklyMgL: 0, status: "optimal" },
        ],
        unknownItemCount: 0,
      },
      proposals: [],
    });

    expect(ready).toMatchObject({
      state: "ready",
      hero: { label: "Scheduled products", value: 1 },
      disclaimerKind: "fertilization-plan",
    });
    expect(ready?.sections.map((section) => section.id)).toEqual([
      "preset",
      "weekly-totals",
      "coverage",
    ]);
    expect(ready?.sections.find((section) => section.id === "coverage")?.rows).toHaveLength(1);
    expect(ready?.sections.find((section) => section.id === "preset")?.rows?.[0]).toMatchObject({
      detail: "Seachem",
      metrics: expect.arrayContaining([{ label: "Method", value: "LIQUID" }]),
    });
  });

  it("normalizes proposal-only plans and identifies the semantically empty plan", () => {
    const proposal = normalizeCalculationPresentation("generate_fertilization_plan", {
      preset_items: [],
      weekly_totals: [],
      coverage: {
        coverage: [{ key: "nitrogen", label: "N", targetMgL: 10, weeklyMgL: 0, status: "missing" }],
        unknownItemCount: 0,
      },
      proposals: [
        {
          id: "simple",
          kind: "simple",
          title: "Alternativa semplice",
          summary: "Backend-localized text is intentionally not presentation copy.",
          items: [
            {
              brandName: "2Hr Aquarist",
              productName: "APT Estimative Index (APT e)",
              method: "LIQUID",
              doseValue: 7.71,
              doseUnit: "ml",
              daysOfWeek: [1],
            },
          ],
          coverage: [
            {
              key: "nitrogen",
              label: "N",
              targetMgL: 10,
              currentMgL: 1.1295,
              deficitMgL: 8.8705,
              deliveredMgL: 2.1845,
              residualMgL: 6.686,
              status: "partial",
            },
          ],
          warnings: [],
          isPartial: true,
          score: 0.49893043866315767,
        },
      ],
    });

    expect(proposal).toMatchObject({
      state: "ready",
      hero: { label: "Proposals", value: 1 },
    });
    expect(proposal?.sections.map((section) => section.id)).toEqual([
      "coverage",
      "proposal-simple",
      "proposal-simple-items",
      "proposal-simple-coverage",
    ]);
    expect(proposal?.sections.map((section) => section.title)).toEqual([
      "Nutrient coverage",
      "Proposals",
      "Products",
      "Nutrient coverage",
    ]);
    expect(proposal?.sections.find((section) => section.id === "proposal-simple")?.metrics)
      .toContainEqual({ label: "Method", value: "simple" });
    expect(JSON.stringify(proposal)).not.toContain("Alternativa semplice");
    expect(JSON.stringify(proposal)).not.toContain("Backend-localized text");
    expect(proposal?.sections.every((section) => !section.title.includes("simple"))).toBe(true);

    const empty = normalizeCalculationPresentation("generate_fertilization_plan", {
      preset_items: [],
      weekly_totals: [],
      coverage: {
        coverage: [
          { key: "nitrogen", label: "N", targetMgL: null, weeklyMgL: 0, status: "optimal" },
        ],
        unknownItemCount: 0,
      },
      proposals: [],
    });
    expect(empty).toMatchObject({ state: "empty", sections: [] });
  });

  it("does not claim unsupported tools", () => {
    expect(normalizeCalculationPresentation("search_fish", { results: [] })).toBeUndefined();
  });
});
