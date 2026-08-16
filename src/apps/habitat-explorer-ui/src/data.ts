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
      if (nested) return nested;
    }
  }

  const parsedContent = parseContentText(source.content);
  if (parsedContent !== undefined) return extractPayload(parsedContent);

  if ("tool" in source && "data" in source) {
    return {
      tool: typeof source.tool === "string" ? source.tool : "unknown",
      data: source.data,
      language:
        typeof source.language === "string"
          ? source.language
          : typeof source.locale === "string"
            ? source.locale
            : undefined,
      isError: source.isError === true,
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
  for (const key of ["results", "suggestions", "matches", "items", "species", "products", "plants", "guides"]) {
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

function imageFromCandidate(value: unknown): string {
  if (typeof value === "string") return safeImageUrl(value);
  const source = asRecord(value);
  for (const key of [...IMAGE_KEYS, "src", "url"]) {
    const image = safeImageUrl(source[key]);
    if (image) return image;
  }
  return "";
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
  return "";
}

export function humanize(value: string) {
  return value
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
    ["Temperature", item.temperature_range ?? water.temperature_range ?? item.temperature, "°C"],
    ["pH", item.ph_range ?? water.ph_range ?? item.ph],
    ["GH", item.gh_range ?? water.gh_range ?? item.gh],
    ["KH", item.kh_range ?? water.kh_range ?? item.kh],
    ["Care", item.care_level ?? item.difficulty],
    ["Compatibility", item.compatibility_level ?? item.level],
    ["Dose", item.dose ?? item.dosage ?? item.dose_ml, item.dose_ml ? "ml" : ""],
    ["Weekly total", item.weekly_total ?? item.weekly_total_ml, item.weekly_total_ml ? "ml" : ""],
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

export function genericMetrics(data: unknown, limit = 8): Metric[] {
  const source = asRecord(data);
  const metrics: Metric[] = [];
  for (const [key, raw] of Object.entries(source)) {
    if (IGNORED_METRIC_KEYS.has(key) || raw === undefined || raw === null || raw === "") continue;
    if (["string", "number", "boolean"].includes(typeof raw)) {
      metrics.push({ label: humanize(key), value: String(raw) });
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
  if (tool === "match_diagnostic_profiles") return "diagnostic";
  if (/fertiliz|nutrient|dose/i.test(tool)) return "fertilization";
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
  return Array.isArray(value)
    ? value.map((item) => (typeof item === "string" ? item : summaryFor(asRecord(item)) || titleFor(asRecord(item)))).filter(Boolean)
    : [];
}
