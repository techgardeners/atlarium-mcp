type DataRecord = Record<string, unknown>;

export type CalculationState = "ready" | "incomplete" | "empty";

export type CalculationMetric = {
  label: string;
  value: boolean | number | string;
  unit?: string;
  status?: string;
};

export type CalculationRow = {
  label: string;
  detail?: string;
  status?: string;
  metrics: CalculationMetric[];
};

export type CalculationSection = {
  id: string;
  title: string;
  metrics?: CalculationMetric[];
  rows?: CalculationRow[];
};

export type CalculationDisclaimerKind =
  | "equipment"
  | "fertilization-plan"
  | "fertilizer-dose"
  | "nutrient-gaps"
  | "tank-volume"
  | "tank-weight"
  | "water-change"
  | "water-chemistry"
  | "weekly-dose-totals";

export type CalculationPresentation = {
  state: CalculationState;
  title: string;
  hero?: CalculationMetric;
  highlights: CalculationMetric[];
  sections: CalculationSection[];
  disclaimerKind?: CalculationDisclaimerKind;
};

function asRecord(value: unknown): DataRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : {};
}

function records(value: unknown): DataRecord[] {
  return Array.isArray(value)
    ? value.map(asRecord).filter((item) => Object.keys(item).length > 0)
    : [];
}

function finiteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function metric(
  label: string,
  value: unknown,
  unit?: string,
  status?: string,
): CalculationMetric | undefined {
  const normalized = finiteNumber(value) ?? nonEmptyString(value) ??
    (typeof value === "boolean" ? value : undefined);
  if (normalized === undefined) return undefined;
  return { label, value: normalized, ...(unit ? { unit } : {}), ...(status ? { status } : {}) };
}

function metrics(
  candidates: Array<CalculationMetric | undefined>,
): CalculationMetric[] {
  return candidates.filter((item): item is CalculationMetric => Boolean(item));
}

function emptyPresentation(
  title: string,
  disclaimerKind?: CalculationDisclaimerKind,
  state: CalculationState = "empty",
): CalculationPresentation {
  return {
    state,
    title,
    highlights: [],
    sections: [],
    ...(disclaimerKind ? { disclaimerKind } : {}),
  };
}

function metricSection(
  id: string,
  title: string,
  values: Array<CalculationMetric | undefined>,
): CalculationSection | undefined {
  const normalized = metrics(values);
  return normalized.length ? { id, title, metrics: normalized } : undefined;
}

function sections(
  candidates: Array<CalculationSection | undefined>,
): CalculationSection[] {
  return candidates.filter((item): item is CalculationSection => Boolean(item));
}

function normalizeTankVolume(data: DataRecord): CalculationPresentation {
  const result = asRecord(data.result);
  if (result.hasRequiredDimensions !== true) {
    return emptyPresentation("Aquarium volume", "tank-volume", "incomplete");
  }

  const hero = metric("Net volume", result.netLiters, "L");
  if (!hero) return emptyPresentation("Aquarium volume", "tank-volume", "incomplete");

  return {
    state: "ready",
    title: "Aquarium volume",
    hero,
    highlights: metrics([
      metric("Gross volume", result.grossLiters, "L"),
      metric("Water weight", result.waterWeightKg, "kg"),
      metric("Footprint", result.footprintM2, "m²"),
    ]),
    sections: sections([
      metricSection("dimensions", "Dimensions", [
        metric("Water height", result.waterHeightCm, "cm"),
        metric("Freeboard", result.freeboardCm, "cm"),
      ]),
      metricSection("surfaces", "Tank surfaces", [
        metric("Base area", result.baseAreaCm2, "cm²"),
        metric("Front area", result.frontAreaCm2, "cm²"),
        metric("Side area", result.sideAreaCm2, "cm²"),
      ]),
    ]),
    disclaimerKind: "tank-volume",
  };
}

function normalizeTankWeight(data: DataRecord): CalculationPresentation {
  const result = asRecord(data.result);
  if (result.hasRequiredDimensions !== true) {
    return emptyPresentation("Aquarium weight", "tank-weight", "incomplete");
  }

  const hero = metric("Total weight", result.totalWeightKg, "kg");
  if (!hero) return emptyPresentation("Aquarium weight", "tank-weight", "incomplete");

  return {
    state: "ready",
    title: "Aquarium weight",
    hero,
    highlights: metrics([
      metric("Net volume", result.netLiters, "L"),
      metric("Water weight", result.waterWeightKg, "kg"),
      metric("Footprint", result.footprintM2, "m²"),
    ]),
    sections: sections([
      metricSection("weight-breakdown", "Weight breakdown", [
        metric("Glass", result.glassWeightKg, "kg"),
        metric("Substrate", result.substrateWeightKg, "kg"),
        metric("Hardscape", result.hardscapeWeightKg, "kg"),
        metric("Equipment", result.equipmentWeightKg, "kg"),
      ]),
      metricSection("substrate", "Substrate", [
        metric("Substrate volume", result.substrateVolumeLiters, "L"),
      ]),
    ]),
    disclaimerKind: "tank-weight",
  };
}

function normalizeWaterChange(data: DataRecord): CalculationPresentation {
  const result = asRecord(data.result);
  const litersPerChange = finiteNumber(result.litersPerChange);
  const weeklyLiters = finiteNumber(result.weeklyLiters);
  const removed = finiteNumber(result.removedAfterChangesPercent);
  if (
    litersPerChange === undefined ||
    weeklyLiters === undefined ||
    (litersPerChange === 0 && weeklyLiters === 0 && (removed ?? 0) === 0)
  ) {
    return emptyPresentation("Water change", "water-change");
  }

  return {
    state: "ready",
    title: "Water change",
    hero: metric("Per change", litersPerChange, "L"),
    highlights: metrics([
      metric("Weekly total", weeklyLiters, "L"),
      metric("Removed after changes", removed, "%"),
      metric("Remaining after changes", result.remainingAfterChangesPercent, "%"),
    ]),
    sections: sections([
      metricSection("dilution", "Dilution", [
        metric("Dilution factor", result.dilutionFactor),
      ]),
    ]),
    disclaimerKind: "water-change",
  };
}

function normalizeWaterChemistry(data: DataRecord): CalculationPresentation {
  const co2 = asRecord(data.co2);
  const generalHardness = asRecord(data.general_hardness);
  const carbonateHardness = asRecord(data.carbonate_hardness);
  const waterMix = asRecord(data.water_mix);
  const salinity = asRecord(data.salinity);

  const normalizedSections = sections([
    metricSection("co2", "CO₂", [
      metric("CO₂", co2.co2MgPerLiter, "mg/L", nonEmptyString(co2.status)),
      metric("Status", co2.status, undefined, nonEmptyString(co2.status)),
    ]),
    metricSection("general-hardness", "General hardness", [
      metric("General hardness", generalHardness.dgh, "dGH"),
      metric("French hardness", generalHardness.fh, "°fH"),
      metric("Millimoles", generalHardness.mmol, "mmol/L"),
      metric("Parts per million", generalHardness.ppm, "ppm"),
    ]),
    metricSection("carbonate-hardness", "Carbonate hardness", [
      metric("Carbonate hardness", carbonateHardness.dkh, "dKH"),
      metric("French hardness", carbonateHardness.fh, "°fH"),
      metric("Milliequivalents", carbonateHardness.meq, "meq/L"),
      metric("Parts per million", carbonateHardness.ppm, "ppm"),
    ]),
    metricSection("water-mix", "Water mix", [
      metric("Source 1", waterMix.source1Liters, "L"),
      metric("Source 1 share", waterMix.source1Percent, "%"),
      metric("Source 2", waterMix.source2Liters, "L"),
      metric("Source 2 share", waterMix.source2Percent, "%"),
      metric("Valid mix", waterMix.valid),
    ]),
    metricSection("salinity", "Salinity", [
      metric("Specific gravity", salinity.specificGravity),
      metric("Density", salinity.densityGcm3, "g/cm³"),
      metric("Conductivity", salinity.conductivityMsCm, "mS/cm"),
      metric("Salt to add", salinity.saltToAddGrams, "g"),
    ]),
  ]);

  const hero =
    metric("CO₂", co2.co2MgPerLiter, "mg/L", nonEmptyString(co2.status)) ??
    metric("General hardness", generalHardness.dgh, "dGH") ??
    metric("Carbonate hardness", carbonateHardness.dkh, "dKH") ??
    metric("Source 1", waterMix.source1Liters, "L") ??
    metric("Specific gravity", salinity.specificGravity);

  if (!hero || !normalizedSections.length) {
    return emptyPresentation("Water chemistry", "water-chemistry");
  }

  return {
    state: "ready",
    title: "Water chemistry",
    hero,
    highlights: [],
    sections: normalizedSections,
    disclaimerKind: "water-chemistry",
  };
}

function normalizeUnitConversions(data: DataRecord): CalculationPresentation {
  const temperature = asRecord(data.temperature);
  const length = asRecord(data.length);
  const weight = asRecord(data.weight);
  const volume = asRecord(data.volume);
  const temperatureDelta = finiteNumber(data.temperature_delta);

  const normalizedSections = sections([
    metricSection("temperature", "Temperature", [
      metric("Celsius", temperature.celsius, "°C"),
      metric("Fahrenheit", temperature.fahrenheit, "°F"),
      metric("Kelvin", temperature.kelvin, "K"),
    ]),
    metricSection("temperature-delta", "Temperature difference", [
      metric("Difference", temperatureDelta, "°C"),
    ]),
    metricSection("length", "Length Cm", [
      metric("Centimeters", length.centimeters, "cm"),
      metric("Millimeters", length.millimeters, "mm"),
      metric("Inches", length.inches, "in"),
      metric("Feet", length.feet, "ft"),
    ]),
    metricSection("weight", "Weight", [
      metric("Grams", weight.grams, "g"),
      metric("Kilograms", weight.kilograms, "kg"),
      metric("Ounces", weight.ounces, "oz"),
      metric("Pounds", weight.pounds, "lb"),
    ]),
    metricSection("volume", "Volume", [
      metric("Liters", volume.liters, "L"),
      metric("Milliliters", volume.milliliters, "mL"),
      metric("US gallons", volume.gallonsUs, "gal US"),
      metric("UK gallons", volume.gallonsUk, "gal UK"),
      metric("Fluid ounces", volume.fluidOunces, "fl oz"),
    ]),
  ]);

  const hero =
    metric("Celsius", temperature.celsius, "°C") ??
    metric("Temperature difference", temperatureDelta, "°C") ??
    metric("Centimeters", length.centimeters, "cm") ??
    metric("Kilograms", weight.kilograms, "kg") ??
    metric("Liters", volume.liters, "L");

  if (!hero || !normalizedSections.length) return emptyPresentation("Unit conversion");

  return {
    state: "ready",
    title: "Unit conversion",
    hero,
    highlights: [],
    sections: normalizedSections,
  };
}

function normalizeEquipmentRequirements(data: DataRecord): CalculationPresentation {
  const heater = asRecord(data.heater);
  const electricity = asRecord(data.electricity);
  const lighting = asRecord(data.lighting);

  const normalizedSections = sections([
    metricSection("heater", "Heater", [
      metric("Recommended power", heater.recommendedWatts, "W"),
      metric("Minimum power", heater.minimumWatts, "W"),
      metric("Temperature difference", heater.deltaC, "°C"),
      metric("Sizing factor", heater.factor),
    ]),
    metricSection("electricity", "Electricity", [
      metric("Daily consumption", electricity.kwhDay, "kWh/day"),
      metric("Daily cost", electricity.dailyCost),
      metric("Monthly cost", electricity.monthlyCost),
      metric("Yearly cost", electricity.yearlyCost),
    ]),
    metricSection("lighting", "Lighting", [
      metric("Level", lighting.level),
      metric("Lumens per liter", lighting.lumensPerLiter, "lm/L"),
      metric("Watts per liter", lighting.wattsPerLiter, "W/L"),
    ]),
  ]);

  const hero =
    metric("Recommended heater power", heater.recommendedWatts, "W") ??
    metric("Daily consumption", electricity.kwhDay, "kWh/day") ??
    metric("Lumens per liter", lighting.lumensPerLiter, "lm/L");

  if (!hero || !normalizedSections.length) {
    return emptyPresentation("Equipment requirements", "equipment");
  }

  return {
    state: "ready",
    title: "Equipment requirements",
    hero,
    highlights: [],
    sections: normalizedSections,
    disclaimerKind: "equipment",
  };
}

function nutrientMetrics(nutrients: DataRecord): CalculationMetric[] {
  const labels: Record<string, string> = {
    boronMgPerMl: "Boron",
    calciumMgPerMl: "Calcium",
    copperMgPerMl: "Copper",
    ironMgPerMl: "Iron",
    magnesiumMgPerMl: "Magnesium",
    manganeseMgPerMl: "Manganese",
    molybdenumMgPerMl: "Molybdenum",
    nitrogenMgPerMl: "Nitrogen",
    phosphorusMgPerMl: "Phosphorus",
    potassiumMgPerMl: "Potassium",
    zincMgPerMl: "Zinc",
  };
  return Object.entries(labels).flatMap(([key, label]) => {
    const item = metric(label, nutrients[key], "mg/mL");
    return item ? [item] : [];
  });
}

function normalizeFertilizerDose(data: DataRecord): CalculationPresentation {
  const productName = nonEmptyString(data.product_name);
  const recommendation = asRecord(data.recommendation);
  const specs = asRecord(data.specs);
  const perDose = finiteNumber(data.per_dose_ml);
  const title = productName ?? "Fertilizer dose";
  if (perDose === undefined || !Object.keys(recommendation).length || !Object.keys(specs).length) {
    const empty = emptyPresentation(title, "fertilizer-dose");
    empty.highlights = metrics([
      metric("Brand", data.brand_name),
      metric("Tank volume", data.volume_liters, "L"),
    ]);
    return empty;
  }

  const nutrients = nutrientMetrics(asRecord(specs.nutrients));
  return {
    state: "ready",
    title,
    hero: metric("Dose per application", perDose, "mL"),
    highlights: metrics([
      metric("Brand", data.brand_name),
      metric("Tank volume", data.volume_liters, "L"),
      metric("Method", specs.method),
    ]),
    sections: sections([
      metricSection("recommendation", "Weekly recommendation", [
        metric("Minimum applications", recommendation.minDoseCount),
        metric("Maximum applications", recommendation.maxDoseCount),
        metric("Minimum weekly dose", recommendation.minWeeklyMl, "mL"),
        metric("Maximum weekly dose", recommendation.maxWeeklyMl, "mL"),
        metric("Frequency", recommendation.frequencyHint),
      ]),
      metricSection("specifications", "Product specifications", [
        metric("Catalog dose", specs.recommendedMlPer100L, "mL/100 L"),
        metric("Contains macronutrients", specs.containsMacros),
        metric("Contains micronutrients", specs.containsMicros),
      ]),
      nutrients.length ? { id: "nutrients", title: "Nutrients", metrics: nutrients } : undefined,
    ]),
    disclaimerKind: "fertilizer-dose",
  };
}

function normalizeNutrientGaps(data: DataRecord): CalculationPresentation {
  const actionable = records(data.gaps).filter((gap) => gap.status !== "no_target");
  if (!actionable.length) return emptyPresentation("Nutrient gaps", "nutrient-gaps");

  const countStatus = (status: string) => actionable.filter((gap) => gap.status === status).length;
  const rows = actionable.map((gap): CalculationRow => ({
    label: nonEmptyString(gap.label) ?? nonEmptyString(gap.key) ?? "Nutrient",
    status: nonEmptyString(gap.status),
    detail: nonEmptyString(gap.sourceKind),
    metrics: metrics([
      metric("Target", gap.targetMgL, "mg/L"),
      metric("Current", gap.currentMgL, "mg/L"),
      metric("Deficit", gap.deficitMgL, "mg/L"),
    ]),
  }));

  return {
    state: "ready",
    title: "Nutrient gaps",
    hero: metric("Nutrients with targets", actionable.length),
    highlights: metrics([
      metric("Below target", countStatus("below"), undefined, "below"),
      metric("Covered", countStatus("covered"), undefined, "covered"),
      metric("Above target", countStatus("above"), undefined, "above"),
      metric("Missing measurements", countStatus("missing_measurement"), undefined, "missing_measurement"),
    ]),
    sections: [{ id: "gaps", title: "Target comparison", rows }],
    disclaimerKind: "nutrient-gaps",
  };
}

function weeklyDoseRows(value: unknown): CalculationRow[] {
  return records(value).map((total): CalculationRow => {
    const recommendation = asRecord(total.recommendation);
    const doseUnit = nonEmptyString(total.doseUnit) ?? "";
    const brandName = nonEmptyString(total.brandName);
    return {
      label: nonEmptyString(total.productName) ?? "Fertilizer",
      ...(brandName ? { detail: brandName } : {}),
      status: nonEmptyString(total.comparisonStatus),
      metrics: metrics([
        metric("Method", total.method),
        metric("Actual weekly dose", total.actualWeeklyDose, doseUnit),
        metric("Scheduled applications", total.scheduledDoseCount),
        metric("Recommended minimum", recommendation.minWeeklyMl, "mL"),
        metric("Recommended maximum", recommendation.maxWeeklyMl, "mL"),
      ]),
    };
  });
}

function normalizeWeeklyDoseTotals(data: DataRecord): CalculationPresentation {
  const rows = weeklyDoseRows(data.totals);
  if (!rows.length) return emptyPresentation("Weekly dose totals", "weekly-dose-totals");

  return {
    state: "ready",
    title: "Weekly dose totals",
    hero: metric("Products", rows.length),
    highlights: metrics([
      metric("Below recommendation", rows.filter((row) => row.status === "below").length, undefined, "below"),
      metric("In range", rows.filter((row) => row.status === "in_range").length, undefined, "in_range"),
      metric("Above recommendation", rows.filter((row) => row.status === "above").length, undefined, "above"),
    ]),
    sections: [{ id: "weekly-totals", title: "Products", rows }],
    disclaimerKind: "weekly-dose-totals",
  };
}

function scheduleRows(value: unknown): CalculationRow[] {
  return records(value).map((item): CalculationRow => {
    const brandName = nonEmptyString(item.brandName);
    const days = Array.isArray(item.daysOfWeek)
      ? item.daysOfWeek.filter((day): day is number => typeof day === "number" && Number.isFinite(day))
      : [];
    return {
      label: nonEmptyString(item.productName) ?? "Fertilizer",
      ...(brandName ? { detail: brandName } : {}),
      metrics: metrics([
        metric("Method", item.method),
        metric("Dose", item.doseValue, nonEmptyString(item.doseUnit)),
        metric("Days", days.join(", ")),
      ]),
    };
  });
}

function coverageRows(value: unknown): CalculationRow[] {
  return records(value)
    .filter((item) =>
      finiteNumber(item.targetMgL) !== undefined ||
      (finiteNumber(item.weeklyMgL) ?? 0) !== 0 ||
      ["high", "low", "missing", "unknown"].includes(String(item.status)),
    )
    .map((item): CalculationRow => ({
      label: nonEmptyString(item.label) ?? nonEmptyString(item.key) ?? "Nutrient",
      status: nonEmptyString(item.status),
      metrics: metrics([
        metric("Target", item.targetMgL, "mg/L"),
        metric("Weekly delivery", item.weeklyMgL, "mg/L"),
      ]),
    }));
}

function proposalSections(value: unknown): CalculationSection[] {
  return records(value).flatMap((proposal, index): CalculationSection[] => {
    const id = nonEmptyString(proposal.id) ?? String(index + 1);
    const proposalItems = scheduleRows(proposal.items);
    const proposalCoverage = records(proposal.coverage).map((item): CalculationRow => ({
      label: nonEmptyString(item.label) ?? nonEmptyString(item.key) ?? "Nutrient",
      status: nonEmptyString(item.status),
      metrics: metrics([
        metric("Target", item.targetMgL, "mg/L"),
        metric("Current", item.currentMgL, "mg/L"),
        metric("Deficit", item.deficitMgL, "mg/L"),
        metric("Delivered", item.deliveredMgL, "mg/L"),
        metric("Residual", item.residualMgL, "mg/L"),
      ]),
    }));
    return sections([
      metricSection(`proposal-${id}`, "Proposals", [
        metric("Method", proposal.kind),
        metric("Score", finiteNumber(proposal.score) === undefined ? undefined : Number(proposal.score) * 100, "%"),
        metric("Partial", proposal.isPartial),
        metric("Items", proposalItems.length),
        metric("Warnings", Array.isArray(proposal.warnings) ? proposal.warnings.length : 0),
      ]),
      proposalItems.length
        ? { id: `proposal-${id}-items`, title: "Products", rows: proposalItems }
        : undefined,
      proposalCoverage.length
        ? { id: `proposal-${id}-coverage`, title: "Nutrient coverage", rows: proposalCoverage }
        : undefined,
    ]);
  });
}

function normalizeFertilizationPlan(data: DataRecord): CalculationPresentation {
  const presetRows = scheduleRows(data.preset_items);
  const weeklyRows = weeklyDoseRows(data.weekly_totals);
  const coverage = asRecord(data.coverage);
  const normalizedCoverage = coverageRows(coverage.coverage);
  const proposals = records(data.proposals);
  const meaningful = presetRows.length || weeklyRows.length || normalizedCoverage.length || proposals.length;
  if (!meaningful) return emptyPresentation("Fertilization plan", "fertilization-plan");

  const primaryCount = weeklyRows.length || presetRows.length || proposals.length;
  const primaryLabel = weeklyRows.length || presetRows.length ? "Scheduled products" : "Proposals";
  return {
    state: "ready",
    title: "Fertilization plan",
    hero: metric(primaryLabel, primaryCount),
    highlights: metrics([
      metric("Preset products", presetRows.length),
      metric("Analyzed products", weeklyRows.length),
      metric("Nutrients", normalizedCoverage.length),
      metric("Proposals", proposals.length),
      metric("Unknown products", coverage.unknownItemCount),
    ]),
    sections: [
      ...(presetRows.length ? [{ id: "preset", title: "Regime preset", rows: presetRows }] : []),
      ...(weeklyRows.length ? [{ id: "weekly-totals", title: "Weekly totals", rows: weeklyRows }] : []),
      ...(normalizedCoverage.length ? [{ id: "coverage", title: "Nutrient coverage", rows: normalizedCoverage }] : []),
      ...proposalSections(data.proposals),
    ],
    disclaimerKind: "fertilization-plan",
  };
}

export function normalizeCalculationPresentation(
  tool: string,
  value: unknown,
): CalculationPresentation | undefined {
  const data = asRecord(value);
  switch (tool) {
    case "calculate_tank_volume":
      return normalizeTankVolume(data);
    case "calculate_tank_weight":
      return normalizeTankWeight(data);
    case "calculate_water_change":
      return normalizeWaterChange(data);
    case "calculate_water_chemistry":
      return normalizeWaterChemistry(data);
    case "convert_units":
      return normalizeUnitConversions(data);
    case "calculate_equipment_requirements":
      return normalizeEquipmentRequirements(data);
    case "calculate_fertilizer_dose":
      return normalizeFertilizerDose(data);
    case "calculate_nutrient_gaps":
      return normalizeNutrientGaps(data);
    case "calculate_weekly_dose_totals":
      return normalizeWeeklyDoseTotals(data);
    case "generate_fertilization_plan":
      return normalizeFertilizationPlan(data);
    default:
      return undefined;
  }
}
