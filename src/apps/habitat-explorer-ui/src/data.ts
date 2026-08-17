export type DataRecord = Record<string, unknown>;

export type ToolPayload = {
  tool: string;
  data: unknown;
  language?: string;
  isError?: boolean;
};

export type Metric = {
  label: string;
  value: string;
};

export type TextSection = {
  title?: string;
  body: string;
};

const IMAGE_KEYS = [
  "image_url",
  "imageUrl",
  "thumbnail_url",
  "thumbnailUrl",
  "thumbnailImage",
  "heroImage",
  "cover_image",
  "coverImage",
  "photo_url",
  "photoUrl",
  "image",
] as const;

const IMAGE_COLLECTION_KEYS = ["images", "media", "photos", "gallery_images", "galleryImages"] as const;
const BRAND_LOGO_KEYS = ["brand_logo_url", "brandLogoUrl", "manufacturer_logo_url", "manufacturerLogoUrl"] as const;
const ALLOWED_IMAGE_HOSTS = new Set(["atlarium.bio", "www.atlarium.bio", "mcp.atlarium.bio"]);
const IGNORED_METRIC_KEYS = new Set([
  "slug",
  "name",
  "title",
  "common_name",
  "scientific_name",
  "latin_name",
  "summary",
  "description",
  "notes",
  "message",
  "reason",
  "rationale",
  "disclaimer",
  ...IMAGE_KEYS,
  ...IMAGE_COLLECTION_KEYS,
  ...BRAND_LOGO_KEYS,
]);

export function asRecord(value: unknown): DataRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : {};
}

function parseContentText(content: unknown) {
  if (!Array.isArray(content)) return undefined;
  const textPart = content.find(
    (entry) => asRecord(entry).type === "text" && typeof asRecord(entry).text === "string",
  );
  if (!textPart) return undefined;
  try {
    return JSON.parse(String(asRecord(textPart).text));
  } catch {
    return undefined;
  }
}

function payloadLanguage(source: DataRecord) {
  return typeof source.language === "string"
    ? source.language
    : typeof source.locale === "string"
      ? source.locale
      : typeof source.language_used === "string"
        ? source.language_used
        : undefined;
}

function inheritPayloadState(payload: ToolPayload, source: DataRecord): ToolPayload {
  const isError = source.isError === true || source.error !== undefined;
  const tool = payload.tool === "unknown" && typeof source.tool === "string"
    ? source.tool
    : payload.tool;
  return {
    ...payload,
    tool,
    language: payload.language ?? payloadLanguage(source),
    ...(isError ? { isError: true } : {}),
  };
}

export function extractPayload(value: unknown): ToolPayload | undefined {
  if (value === undefined || value === null) return undefined;
  const source = asRecord(value);

  for (const key of [
    "structuredContent",
    "toolOutput",
    "mcp_tool_result",
    "call_tool_result",
    "toolResult",
    "result",
  ]) {
    if (source[key] !== undefined) {
      const nested = extractPayload(source[key]);
      if (nested) return inheritPayloadState(nested, source);
    }
  }

  const parsedContent = parseContentText(source.content);
  if (parsedContent !== undefined) {
    const nested = extractPayload(parsedContent);
    if (nested) return inheritPayloadState(nested, source);
  }

  if ("tool" in source && "data" in source) {
    return {
      tool: typeof source.tool === "string" ? source.tool : "unknown",
      data: source.data,
      language: payloadLanguage(source) ?? payloadLanguage(asRecord(source.data)),
      ...(source.isError === true || source.error !== undefined ? { isError: true } : {}),
    };
  }

  if (source.isError === true || source.error !== undefined) {
    return {
      tool: typeof source.tool === "string" ? source.tool : "unknown",
      data: source.error ?? source.content ?? source,
      language: payloadLanguage(source),
      isError: true,
    };
  }

  if (Object.keys(source).length > 0 || Array.isArray(value)) {
    return { tool: "unknown", data: value };
  }

  return undefined;
}

export function itemsFrom(data: unknown): DataRecord[] {
  if (Array.isArray(data)) return data.map(asRecord).filter((item) => Object.keys(item).length > 0);
  const source = asRecord(data);
  for (const key of [
    "results",
    "suggestions",
    "matches",
    "items",
    "species",
    "products",
    "plants",
    "guides",
    "categories",
    "brands",
  ]) {
    if (Array.isArray(source[key])) {
      return (source[key] as unknown[]).map(asRecord).filter((item) => Object.keys(item).length > 0);
    }
  }
  return Object.keys(source).length > 0 ? [source] : [];
}

export function titleFor(item: DataRecord) {
  return String(
    item.common_name ??
      item.name ??
      item.title ??
      item.product_name ??
      item.slug ??
      item.scientific_name ??
      "Atlarium result",
  );
}

export function scientificFor(item: DataRecord) {
  return String(item.scientific_name ?? item.latin_name ?? item.brand ?? "");
}

export function summaryFor(item: DataRecord) {
  return String(
    item.summary ??
      item.description ??
      item.short_description ??
      item.care_summary ??
      item.explanation ??
      item.message ??
      item.reason ??
      item.rationale ??
      item.notes ??
      "",
  );
}

function plainEditorialText(value: string) {
  return value
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function textSections(value: unknown): TextSection[] {
  const text = plainEditorialText(typeof value === "string" ? value : "");
  if (!text) return [];

  const headingPattern = /(^|[.!?]\s+)([\p{Lu}][\p{L}\p{M}\d/&'’()+,\- ]{2,72}):\s+/gu;
  const headings = [...text.matchAll(headingPattern)].map((match) => ({
    bodyStart: (match.index ?? 0) + match[0].length,
    headingStart: (match.index ?? 0) + (match[1] ?? "").length,
    title: (match[2] ?? "").trim(),
  }));

  const firstHeading = headings[0];
  if (!firstHeading) return [{ body: text }];

  const sections: TextSection[] = [];
  const introduction = text.slice(0, firstHeading.headingStart).trim();
  if (introduction) sections.push({ body: introduction });

  for (const [index, heading] of headings.entries()) {
    const end = headings[index + 1]?.headingStart ?? text.length;
    const body = text.slice(heading.bodyStart, end).trim();
    if (body) sections.push({ title: heading.title, body });
  }

  return sections;
}

export function safeImageUrl(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";
  if (/^data:image\/(png|jpe?g|webp|gif|avif);base64,/i.test(text)) return text;
  try {
    const url = text.startsWith("/") ? new URL(text, "https://atlarium.bio") : new URL(text);
    return url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(url.hostname) ? url.href : "";
  } catch {
    return "";
  }
}

function optimizedAtlariumImage(
  source: string,
  { preset = "card", quality = 78, width = 828 } = {},
) {
  const image = new URL(
    `/api/img/img-wm-v11/${preset}-w${width}-q${quality}.webp`,
    "https://atlarium.bio",
  );
  image.searchParams.set("src", source);
  image.searchParams.set("v", "img-wm-v11");
  image.searchParams.set("w", String(width));
  image.searchParams.set("q", String(quality));
  image.searchParams.set("f", "webp");
  image.searchParams.set("p", preset);
  return image.href;
}

function mediaImageUrl(value: unknown) {
  const safe = safeImageUrl(value);
  if (!safe || safe.startsWith("data:")) return safe;
  try {
    const image = new URL(safe);
    return image.pathname.startsWith("/media/catalog/")
      ? optimizedAtlariumImage(image.pathname)
      : safe;
  } catch {
    return "";
  }
}

function imageFromCandidate(value: unknown): string {
  if (typeof value === "string") return mediaImageUrl(value);
  const source = asRecord(value);
  for (const key of [...IMAGE_KEYS, "src", "url"]) {
    const image = mediaImageUrl(source[key]);
    if (image) return image;
  }
  return "";
}

function catalogImageFromPublicUrl(item: DataRecord) {
  const publicUrl = typeof item.public_url === "string" ? item.public_url.trim() : "";
  const slug = typeof item.slug === "string" ? item.slug.trim() : "";
  if (!publicUrl || !/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(slug)) return "";

  try {
    const page = new URL(publicUrl);
    if (page.protocol !== "https:" || !ALLOWED_IMAGE_HOSTS.has(page.hostname)) return "";

    const segments = page.pathname.split("/").filter(Boolean);
    const catalogIndex = segments.indexOf("catalog");
    const category = catalogIndex >= 0 ? segments[catalogIndex + 1] : undefined;
    const publicSlug = catalogIndex >= 0 ? segments[catalogIndex + 2] : undefined;
    const mediaCategory = category === "fish"
      ? "fish"
      : category === "plants"
        ? "plant"
        : category === "invertebrates"
          ? "invertebrate"
          : undefined;
    if (!mediaCategory || publicSlug !== slug) return "";

    return optimizedAtlariumImage(
      `/media/catalog/species/${mediaCategory}/${slug}/01-ai.png`,
    );
  } catch {
    return "";
  }
}

function productLocationFromPublicUrl(item: DataRecord) {
  const publicUrl = typeof item.public_url === "string" ? item.public_url.trim() : "";
  const slug = typeof item.slug === "string" ? item.slug.trim() : "";
  if (!publicUrl) return undefined;

  try {
    const page = new URL(publicUrl);
    if (page.protocol !== "https:" || !ALLOWED_IMAGE_HOSTS.has(page.hostname)) return undefined;

    const pageParts = page.pathname.split("/").filter(Boolean);
    const productsIndex = pageParts.indexOf("products");
    const publicParts = productsIndex >= 0 ? pageParts.slice(productsIndex - 1) : [];
    const publicKind = publicParts[2];
    if (
      publicParts.length !== 6 ||
      publicParts[0] !== "guide" ||
      publicParts[1] !== "products" ||
      (publicKind !== "equipment" && publicKind !== "fertilizers") ||
      !publicParts.slice(3).every((part) => /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(part))
    ) return undefined;

    const kind = publicKind === "fertilizers" ? "fertilizer" : "equipment";
    const [, , , categorySlug, brandSlug, productSlug] = publicParts;
    if (slug) {
      const expectedSlug = [kind, categorySlug, brandSlug, productSlug].join("/");
      if (slug !== expectedSlug) return undefined;
    }

    return {
      brandSlug,
      categorySlug,
      kind,
      productSlug,
    };
  } catch {
    return undefined;
  }
}

export function imageFor(item: DataRecord) {
  for (const key of IMAGE_KEYS) {
    const image = imageFromCandidate(item[key]);
    if (image) return image;
  }
  for (const key of IMAGE_COLLECTION_KEYS) {
    const values = Array.isArray(item[key]) ? (item[key] as unknown[]) : [];
    for (const candidate of values) {
      const image = imageFromCandidate(candidate);
      if (image) return image;
    }
  }
  // Product media is intentionally never inferred from a slug: production uses
  // mixed extensions and some products have no image. Only render exact media
  // returned by the tool; otherwise the brand lockup remains the visual anchor.
  return catalogImageFromPublicUrl(item);
}

export function brandNameFor(item: DataRecord) {
  const brand = typeof item.brand === "string" ? item.brand : asRecord(item.brand).name;
  return typeof brand === "string" ? brand.trim() : "";
}

export function brandLogoFor(item: DataRecord) {
  for (const key of BRAND_LOGO_KEYS) {
    const image = optimizedBrandLogo(item[key]);
    if (image) return image;
  }
  const nestedBrand = asRecord(item.brand);
  for (const key of [...BRAND_LOGO_KEYS, "logo", "image_url", "imageUrl"]) {
    const image = optimizedBrandLogo(nestedBrand[key]);
    if (image) return image;
  }
  const location = productLocationFromPublicUrl(item);
  return location?.brandSlug
    ? optimizedAtlariumImage(`/images/manufacturers/${location.brandSlug}.png`, {
        preset: "micro",
        quality: 65,
        width: 160,
      })
    : "";
}

function optimizedBrandLogo(value: unknown) {
  const safe = safeImageUrl(value);
  if (!safe || safe.startsWith("data:")) return safe;
  try {
    const logo = new URL(safe);
    return logo.pathname.startsWith("/images/manufacturers/")
      ? optimizedAtlariumImage(logo.pathname, {
          preset: "micro",
          quality: 65,
          width: 160,
        })
      : safe;
  } catch {
    return "";
  }
}

export function humanize(value: string) {
  return value
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function rangeLabel(value: unknown, fallbackUnit = "") {
  const source = asRecord(value);
  if (Object.keys(source).length === 0) return "";
  const min = source.min ?? source.minimum;
  const max = source.max ?? source.maximum;
  if (min === undefined && max === undefined) return "";
  const unit = String(source.unit ?? fallbackUnit);
  const number = min !== undefined && max !== undefined ? `${min}–${max}` : String(min ?? max);
  return `${number}${unit ? ` ${unit}` : ""}`;
}

export function primaryMetrics(item: DataRecord, limit = 4): Metric[] {
  const water = asRecord(item.water_parameters);
  const candidates: Array<[string, unknown, string?]> = [
    ["Tank", item.min_tank_liters ?? item.minimum_tank_liters ?? item.tank_liters, "L"],
    ["Volume", item.recommended_volume_liters ?? item.max_tank_liters, "L"],
    ["Flow", item.flow_liters_hour ?? item.flow_rate_lph, "L/h"],
    ["Temperature", item.temperature_range ?? water.temperature_range ?? item.temperature, "°C"],
    ["pH", item.ph_range ?? water.ph_range ?? item.ph],
    ["GH", item.gh_range ?? water.gh_range ?? item.gh],
    ["KH", item.kh_range ?? water.kh_range ?? item.kh],
    ["Care", item.care_level ?? item.difficulty],
    ["Compatibility", item.compatibility_level ?? item.level],
    ["Dose", item.dose ?? item.dosage ?? item.dose_ml, item.dose_ml ? "ml" : ""],
    ["Weekly total", item.weekly_total ?? item.weekly_total_ml, item.weekly_total_ml ? "ml" : ""],
    ["Category", item.category],
    ["Use case", item.use_case],
  ];

  const metrics: Metric[] = [];
  for (const [label, raw, suffix = ""] of candidates) {
    if (raw === undefined || raw === null || raw === "") continue;
    const range = rangeLabel(raw, suffix);
    const value = range || `${String(raw)}${suffix ? ` ${suffix}` : ""}`;
    if (!metrics.some((metric) => metric.label === label)) metrics.push({ label, value });
    if (metrics.length >= limit) return metrics;
  }
  return metrics;
}

function productMetricValue(key: string, raw: unknown) {
  if (raw === undefined || raw === null || raw === "") return "";
  if (Array.isArray(raw)) {
    return raw
      .filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
      .slice(0, 2)
      .join(" · ");
  }
  if (typeof raw === "boolean") return String(raw);
  const suffixes: Record<string, string> = {
    flowRateLitersHour: "L/h",
    flow_rate_lph: "L/h",
    powerWatts: "W",
    power_watts: "W",
    recommended_ml_per_100_l: "ml / 100 L",
    tankVolumeLiters: "L",
    volumeLiters: "L",
  };
  const suffix = suffixes[key] ?? (/MgPerMl$/.test(key) ? "mg/ml" : "");
  return `${String(raw)}${suffix ? ` ${suffix}` : ""}`;
}

export function productMetrics(item: DataRecord, limit = 8): Metric[] {
  const metrics: Metric[] = [];
  const dosage = asRecord(item.dosage_information);
  const candidates: Array<[string, string, unknown]> = [
    ["Category", "category", item.category ?? item.category_slug],
    ["Method", "method", item.method],
    ["Recommended dose", "recommended_ml_per_100_l", item.recommended_ml_per_100_l ?? dosage.recommended_ml_per_100_l],
    ["Frequency", "frequency_hint", item.frequency_hint ?? dosage.frequency_hint],
    ["Use case", "use_cases", item.use_case ?? item.use_cases],
    ["Contains macros", "contains_macros", item.contains_macros],
    ["Contains micros", "contains_micros", item.contains_micros],
  ];
  const specs = asRecord(item.specs);
  for (const [key, raw] of Object.entries(specs)) {
    candidates.push([humanize(key), key, raw]);
  }
  const nutrients = asRecord(item.nutrients);
  for (const [key, raw] of Object.entries(nutrients)) {
    candidates.push([humanize(key), key, raw]);
  }

  for (const [label, key, raw] of candidates) {
    const value = productMetricValue(key, raw);
    if (!value || metrics.some((metric) => metric.label === label)) continue;
    metrics.push({ label, value });
    if (metrics.length >= limit) break;
  }
  return metrics;
}

export function genericMetrics(data: unknown, limit = 8): Metric[] {
  const source = asRecord(data);
  const metrics: Metric[] = [];
  const units: Record<string, string> = {
    displacement_percent: "%",
    dose_ml: "ml",
    estimated_net_volume_liters: "L",
    flow_liters_hour: "L/h",
    gross_volume_liters: "L",
    height_cm: "cm",
    length_cm: "cm",
    target_nitrate_ppm: "ppm",
    target_phosphate_ppm: "ppm",
    weekly_total_ml: "ml",
    width_cm: "cm",
  };
  for (const [key, raw] of Object.entries(source)) {
    if (IGNORED_METRIC_KEYS.has(key) || raw === undefined || raw === null || raw === "") continue;
    if (["string", "number", "boolean"].includes(typeof raw)) {
      metrics.push({ label: humanize(key), value: `${String(raw)}${units[key] ? ` ${units[key]}` : ""}` });
    } else {
      const range = rangeLabel(raw);
      if (range) metrics.push({ label: humanize(key), value: range });
    }
    if (metrics.length >= limit) break;
  }
  return metrics;
}

export type ViewKind =
  | "collection"
  | "profile"
  | "product"
  | "compatibility"
  | "suggestions"
  | "habitat"
  | "diagnostic"
  | "fertilization"
  | "calculator";

export function viewKind(tool: string): ViewKind {
  if (tool === "check_species_compatibility") return "compatibility";
  if (tool === "suggest_species_for_tank") return "suggestions";
  if (tool === "suggest_habitat_for_tank") return "habitat";
  if ([
    "match_diagnostic_profiles",
    "get_algae_profile",
    "get_disease_profile",
    "get_plant_problem_profile",
    "get_medicine_profile",
  ].includes(tool)) return "diagnostic";
  if (["get_product_profile", "get_equipment_profile", "get_fertilizer_profile"].includes(tool)) return "product";
  if ([
    "calculate_fertilizer_dose",
    "calculate_nutrient_gaps",
    "calculate_weekly_dose_totals",
    "generate_fertilization_plan",
  ].includes(tool)) return "fertilization";
  if (/^calculate_|^convert_units$/.test(tool)) return "calculator";
  if (/^search_|^list_/.test(tool)) return "collection";
  return "profile";
}

export function detailToolFor(searchTool: string) {
  const mapping: Record<string, string> = {
    search_fish: "get_fish_profile",
    search_plants: "get_plant_profile",
    search_products: "get_product_profile",
    search_guides: "get_guide",
    search_algae: "get_algae_profile",
    search_diseases: "get_disease_profile",
    search_plant_problems: "get_plant_problem_profile",
    search_medicines: "get_medicine_profile",
    search_equipment: "get_equipment_profile",
    search_fertilizers: "get_fertilizer_profile",
    search_fertilization_regimes: "get_fertilization_regime",
  };
  return mapping[searchTool];
}

export function stringList(value: unknown) {
  const markdownItems = (text: string) => text
    .replace(/\r/g, "")
    .replace(/(^|\s)(?=#{1,6}\s+)/g, "$1\n")
    .replace(/\s+(?=(?:[-+*]|\d+[.)])\s+)/g, "\n")
    .replace(/\s+(?=>\s+)/g, "\n")
    .replace(/\s+(?=\|)/g, "\n")
    .split(/\n+/)
    .map((item) => item
      .replace(/^#{1,6}\s+/, "")
      .replace(/^(?:[-+*]|\d+[.)])\s+/, "")
      .replace(/^>\s?/, "")
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
      .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^\|\s*|\s*\|$/g, "")
      .replace(/\s*\|\s*/g, " · ")
      .replace(/\s+/g, " ")
      .trim())
    .filter((item) => item && !/^(?:[-:]+\s*·\s*)+[-:]+$/.test(item));

  if (typeof value === "string") return markdownItems(value);
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const text = typeof item === "string"
      ? item
      : summaryFor(asRecord(item)) || titleFor(asRecord(item));
    return text ? markdownItems(text) : [];
  });
}
