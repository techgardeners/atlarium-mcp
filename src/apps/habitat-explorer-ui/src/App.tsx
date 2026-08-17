import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Image } from "@openai/apps-sdk-ui/components/Image";
import { ShimmerText } from "@openai/apps-sdk-ui/components/ShimmerText";
import { useEffect, useMemo, useState } from "react";

import mascotChameleon from "../assets/mascot-chameleon-accent.webp";
import mascotFish from "../assets/mascot-fish-accent.webp";
import {
  normalizeCalculationPresentation,
  type CalculationMetric,
} from "./calculation";
import {
  callTool,
  canRequestDisplayMode,
  persistWidgetState,
  requestDisplayMode,
  sendFollowUp,
  useOpenAiHost,
} from "./bridge";
import {
  localizeCompatibilityLevel,
  localizeCompatibilityList,
  localizeCompatibilityText,
} from "./compatibility";
import { languageFrom, useCopy } from "./copy";
import {
  asRecord,
  brandLogoFor,
  brandNameFor,
  detailToolFor,
  genericMetrics,
  imageFor,
  itemsFrom,
  primaryMetrics,
  productMetrics,
  scientificFor,
  stringList,
  summaryFor,
  textSections,
  titleFor,
  viewKind,
  type DataRecord,
  type Metric,
  type ToolPayload,
} from "./data";

type ViewProps = {
  payload: ToolPayload;
  language: ReturnType<typeof languageFrom>;
  fullscreen: boolean;
};

function MetricGrid({ metrics, language }: { metrics: Metric[]; language: ViewProps["language"] }) {
  const copy = useCopy(language);
  if (!metrics.length) return null;
  return (
    <dl className="metric-grid">
      {metrics.map((metric) => (
        <div className="metric" key={`${metric.label}:${metric.value}`}>
          <dt>{copy.metricLabel(metric.label)}</dt>
          <dd>{copy.statusLabel(metric.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function Media({ item, className = "feature-media" }: { item: DataRecord; className?: string }) {
  const src = imageFor(item);
  const [failed, setFailed] = useState(false);
  const title = titleFor(item);
  const scientific = scientificFor(item);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) return null;
  return (
    <Image
      className={className}
      src={src}
      alt={scientific ? `${title} — ${scientific}` : title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function BrandMark({ item, compact = false }: { item: DataRecord; compact?: boolean }) {
  const brand = brandNameFor(item);
  const src = brandLogoFor(item);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);
  if (!brand) return null;
  return (
    <span
      className={compact ? "brand-lockup brand-lockup--compact" : "brand-lockup"}
      data-brand-logo={src && !failed ? "loaded" : "unavailable"}
    >
      {src && !failed ? (
        <img src={src} alt={`${brand} logo`} loading="lazy" onError={() => setFailed(true)} />
      ) : null}
      <span>{brand}</span>
    </span>
  );
}

function MascotAccent({ character, language }: { character: "chameleon" | "fish"; language: ViewProps["language"] }) {
  const label = character === "chameleon"
    ? language === "it"
      ? "Il camaleonte arancione, guida Atlarium"
      : language === "es"
        ? "El camaleón naranja, guía de Atlarium"
        : "Atlarium's orange chameleon guide"
    : language === "it"
      ? "Il pesce blu, guida Atlarium"
      : language === "es"
        ? "El pez azul, guía de Atlarium"
        : "Atlarium's blue fish guide";
  return (
    <span
      className={`mascot-accent mascot-accent--${character}`}
      data-mascot-accent={character}
      role="img"
      aria-label={label}
    >
      <img
        src={character === "chameleon" ? mascotChameleon : mascotFish}
        alt=""
        aria-hidden="true"
      />
    </span>
  );
}

function ViewActions({
  allowExpand,
  fullscreen,
  followUp,
  followUpLabel,
  language,
}: {
  allowExpand: boolean;
  fullscreen: boolean;
  followUp?: string;
  followUpLabel: string;
  language: ViewProps["language"];
}) {
  const copy = useCopy(language);
  if ((!allowExpand || !canRequestDisplayMode()) && !followUp) return null;
  return (
    <div className="action-row">
      {allowExpand && canRequestDisplayMode() ? (
        <Button
          color="primary"
          size="lg"
          onClick={() => void requestDisplayMode(fullscreen ? "inline" : "fullscreen")}
        >
          {fullscreen ? copy.collapse : copy.expand}
        </Button>
      ) : null}
      {followUp ? (
        <Button color="secondary" variant="outline" size="lg" onClick={() => sendFollowUp(followUp)}>
          {followUpLabel}
        </Button>
      ) : null}
    </div>
  );
}

function StateView({ kind, language }: { kind: "waiting" | "empty" | "error"; language: ReturnType<typeof languageFrom> }) {
  const copy = useCopy(language);
  const title = kind === "waiting" ? copy.waitingTitle : kind === "error" ? copy.errorTitle : copy.emptyTitle;
  const body = kind === "waiting" ? copy.waitingBody : kind === "error" ? copy.errorBody : copy.emptyBody;
  return (
    <section className="state-view" data-state={kind}>
      <MascotAccent character={kind === "waiting" ? "fish" : "chameleon"} language={language} />
      <div className="state-copy">
        <p className="eyebrow">{copy.fieldGuide}</p>
        <h1>{kind === "waiting" ? <ShimmerText>{title}</ShimmerText> : title}</h1>
        <p>{body}</p>
      </div>
    </section>
  );
}

function CollectionView({ payload, language }: ViewProps) {
  const copy = useCopy(language);
  const source = asRecord(payload.data);
  const items = itemsFrom(payload.data).slice(0, 8);
  const restoredIndex = Number(window.openai?.widgetState?.selectedIndex ?? 0);
  const [selectedIndex, setSelectedIndex] = useState(
    Number.isInteger(restoredIndex) && restoredIndex >= 0 && restoredIndex < items.length ? restoredIndex : 0,
  );
  const detailTool = detailToolFor(payload.tool);
  const productCollection = /product|equipment|fertilizer/i.test(payload.tool);
  const categoryCollection = Array.isArray(source.categories);
  const brandCollection = Array.isArray(source.brands);
  const directoryLabels = {
    en: { brands: "Brands", country: "Country", equipment: "Equipment", fertilizers: "Fertilizers", products: "Products", type: "Type", yes: "Yes", no: "No" },
    it: { brands: "Marchi", country: "Paese", equipment: "Attrezzatura", fertilizers: "Fertilizzanti", products: "Prodotti", type: "Tipo", yes: "Sì", no: "No" },
    es: { brands: "Marcas", country: "País", equipment: "Equipamiento", fertilizers: "Fertilizantes", products: "Productos", type: "Tipo", yes: "Sí", no: "No" },
  }[language];

  useEffect(() => setSelectedIndex(0), [payload.tool]);
  if (!items.length) return <StateView kind="empty" language={language} />;

  return (
    <section className="collection-view">
      <header className="section-heading">
        <div>
          <p className="eyebrow">{copy.toolResult}</p>
          <h1>{copy.resultCount(items.length)}</h1>
        </div>
        <Badge color="info" variant="soft" size="md">{copy.readOnly}</Badge>
      </header>
      <div className="carousel" aria-label={copy.resultCount(items.length)}>
        {items.map((item, index) => {
          const selected = index === selectedIndex;
          const slug = typeof item.slug === "string" ? item.slug : "";
          const brandSlug = brandCollection && /^[a-z0-9-]+$/i.test(slug) ? slug.toLowerCase() : "";
          const displayItem = brandCollection
            ? {
                ...item,
                brand: titleFor(item),
                ...(brandSlug ? { brand_logo_url: `https://atlarium.bio/images/manufacturers/${brandSlug}.png` } : {}),
              }
            : item;
          const directoryMetrics: Metric[] = categoryCollection
            ? [
                { label: directoryLabels.brands, value: String(item.brandCount ?? item.brand_count ?? 0) },
                { label: directoryLabels.products, value: String(item.productCount ?? item.product_count ?? 0) },
                ...(item.type ? [{ label: directoryLabels.type, value: String(item.type).replaceAll("_", " ") }] : []),
              ]
            : brandCollection
              ? [
                  ...(item.country ? [{ label: directoryLabels.country, value: String(item.country) }] : []),
                  ...(item.hasEquipment !== undefined || item.has_equipment !== undefined
                    ? [{ label: directoryLabels.equipment, value: (item.hasEquipment ?? item.has_equipment) ? directoryLabels.yes : directoryLabels.no }]
                    : []),
                  ...(item.hasFertilizers !== undefined || item.has_fertilizers !== undefined
                    ? [{ label: directoryLabels.fertilizers, value: (item.hasFertilizers ?? item.has_fertilizers) ? directoryLabels.yes : directoryLabels.no }]
                    : []),
                ]
              : [];
          const itemDetailTool = payload.tool === "search_products"
            ? slug.startsWith("equipment/")
              ? "get_equipment_profile"
              : slug.startsWith("fertilizer/")
                ? "get_fertilizer_profile"
                : detailTool
            : detailTool;
          return (
            <article className={`${selected ? "result-card is-selected" : "result-card"}${productCollection ? " is-product" : ""}`} key={`${slug}:${index}`}>
              <button
                className="result-select"
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setSelectedIndex(index);
                  persistWidgetState({ selectedIndex: index, tool: payload.tool });
                }}
              >
                {!categoryCollection && !brandCollection ? <Media className={productCollection ? "result-media product-card-media" : "result-media"} item={item} /> : null}
                {productCollection || brandCollection ? <BrandMark item={displayItem} compact /> : null}
                <span className="result-copy">
                  <strong>{titleFor(item)}</strong>
                  {!productCollection && !brandCollection && scientificFor(item) ? <em>{scientificFor(item)}</em> : null}
                  <span>{summaryFor(item)}</span>
                </span>
              </button>
              <MetricGrid metrics={directoryMetrics.length ? directoryMetrics.slice(0, 3) : productCollection ? productMetrics(item, 3) : primaryMetrics(item, 3)} language={language} />
              {itemDetailTool && slug ? (
                <Button
                  color="secondary"
                  variant="outline"
                  size="md"
                  block
                  onClick={() => void callTool(itemDetailTool, { slug, language })}
                >
                  {copy.details}
                </Button>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProfileView({ payload, language, fullscreen }: ViewProps) {
  const copy = useCopy(language);
  const item = asRecord(itemsFrom(payload.data)[0] ?? payload.data);
  if (!Object.keys(item).length) return <StateView kind="empty" language={language} />;
  const slug = typeof item.slug === "string" ? item.slug : "";
  const canGetWater = slug && /fish|plant/.test(payload.tool);
  const followUp = copy.careFollowUp(titleFor(item));
  const metrics = primaryMetrics(item, fullscreen ? 6 : 4);
  const sections = textSections(summaryFor(item));
  const visibleSections = fullscreen ? sections : sections.slice(0, 2);
  const hasMedia = Boolean(imageFor(item));
  return (
    <article className={`profile-view${fullscreen ? " is-fullscreen" : ""}${hasMedia ? " has-media" : ""}`}>
      <div className={`profile-hero${hasMedia ? " has-media" : ""}`}>
        {hasMedia ? <div className="profile-visual"><Media item={item} /></div> : null}
        <header className="profile-summary">
          <p className="eyebrow">{copy.toolResult}</p>
          <h1>{titleFor(item)}</h1>
          {scientificFor(item) ? <p className="scientific">{scientificFor(item)}</p> : null}
          <MetricGrid metrics={metrics} language={language} />
        </header>
      </div>
      <div className="profile-body">
        {visibleSections.length ? (
          <div className={fullscreen ? "profile-sections" : "profile-sections is-preview"}>
            {visibleSections.map((section, index) => (
              <section className="profile-section" key={`${section.title ?? "intro"}:${index}`}>
                {section.title ? <h2>{section.title}</h2> : null}
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        ) : null}
        <div className="action-row">
          {canGetWater ? (
            <Button
              color="primary"
              size="lg"
              onClick={() => void callTool("get_water_parameters", { type: payload.tool.includes("plant") ? "plant" : "fish", slug, language })}
            >
              {copy.water}
            </Button>
          ) : null}
          {canRequestDisplayMode() ? (
            <Button color="secondary" variant="outline" size="lg" onClick={() => void requestDisplayMode(fullscreen ? "inline" : "fullscreen")}>
              {fullscreen ? copy.collapse : copy.expand}
            </Button>
          ) : !canGetWater ? (
            <Button color="secondary" variant="outline" size="lg" onClick={() => sendFollowUp(followUp)}>
              {copy.askMore}
            </Button>
          ) : null}
        </div>
        <p className="advisory">{copy.advisory}</p>
      </div>
    </article>
  );
}

function ProductProfileView({ payload, language, fullscreen }: ViewProps) {
  const copy = useCopy(language);
  const item = asRecord(itemsFrom(payload.data)[0] ?? payload.data);
  if (!Object.keys(item).length) return <StateView kind="empty" language={language} />;
  const metrics = productMetrics(item, fullscreen ? 10 : 6);
  const summary = summaryFor(item);
  const hasMedia = Boolean(imageFor(item));
  return (
    <article className={`product-view${fullscreen ? " is-fullscreen" : ""}`}>
      <header className={`product-hero${hasMedia ? " has-media" : ""}`}>
        {hasMedia ? <div className="product-visual"><Media className="product-media" item={item} /></div> : null}
        <div className="product-summary">
          <p className="eyebrow">{copy.productProfile}</p>
          <BrandMark item={item} />
          <h1>{titleFor(item)}</h1>
          <MetricGrid metrics={metrics.slice(0, 4)} language={language} />
        </div>
      </header>
      {summary ? (
        <section className="product-overview">
          <h2>{copy.overview}</h2>
          <p>{summary}</p>
        </section>
      ) : null}
      {metrics.length > 4 ? (
        <section className="product-specifications">
          <h2>{copy.specifications}</h2>
          <MetricGrid metrics={metrics.slice(4)} language={language} />
        </section>
      ) : null}
      <ViewActions
        allowExpand
        fullscreen={fullscreen}
        followUp={copy.productFollowUp(titleFor(item))}
        followUpLabel={copy.askMore}
        language={language}
      />
      <p className="advisory">{copy.advisory}</p>
    </article>
  );
}

function NoticeList({ title, values, tone = "default" }: { title: string; values: string[]; tone?: "default" | "warning" }) {
  if (!values.length) return null;
  return (
    <section className={`notice-list notice-list--${tone}`}>
      <h2>{title}</h2>
      <ul>{values.map((value) => <li key={value}>{value}</li>)}</ul>
    </section>
  );
}

function CompatibilityView({ payload, language, fullscreen }: ViewProps) {
  const copy = useCopy(language);
  const data = asRecord(payload.data);
  const profiles = Array.isArray(data.species_profiles) ? data.species_profiles.map(asRecord) : [];
  const level = String(data.compatibility_level ?? data.level ?? copy.compatibility);
  const localizedLevel = localizeCompatibilityLevel(level, language);
  const rawSummary = summaryFor(data);
  const summary = rawSummary ? localizeCompatibilityText(rawSummary, language) : "";
  const warnings = localizeCompatibilityList([
    ...stringList(data.parameter_mismatches),
    ...stringList(data.warnings),
    ...stringList(data.issues),
  ], language);
  const actions = localizeCompatibilityList(stringList(data.recommended_actions), language);
  return (
    <article className="compatibility-view">
      <header className="verdict">
        <div>
          <p className="eyebrow">{copy.compatibility}</p>
          <h1>{localizedLevel}</h1>
          {summary ? <p className="lede">{summary}</p> : null}
        </div>
        <Badge color={/incompatible|avoid|risk|caution/i.test(level) ? "warning" : "success"} variant="soft" size="lg">
          {localizedLevel}
        </Badge>
      </header>
      {profiles.length ? (
        <section>
          <h2 className="subheading">{copy.speciesReviewed}</h2>
          <div className="species-pair">
            {profiles.slice(0, fullscreen ? 8 : 2).map((profile) => (
              <div className={imageFor(profile) ? "species-row has-media" : "species-row"} key={String(profile.slug ?? titleFor(profile))}>
                {imageFor(profile) ? <Media className="species-avatar" item={profile} /> : null}
                <div><strong>{titleFor(profile)}</strong><span>{scientificFor(profile)}</span></div>
                <MetricGrid metrics={primaryMetrics(profile, 2)} language={language} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <div className="compatibility-grid">
        <NoticeList title={copy.watchPoints} values={warnings} tone="warning" />
        <NoticeList title={copy.recommendedActions} values={actions} />
      </div>
      <ViewActions
        allowExpand={profiles.length > 2 || warnings.length + actions.length > 5}
        fullscreen={fullscreen}
        followUp={copy.compatibilityFollowUp(localizedLevel)}
        followUpLabel={copy.askMore}
        language={language}
      />
      <p className="advisory">{copy.advisory}</p>
    </article>
  );
}

function SuggestionsView({ payload, language, fullscreen }: ViewProps) {
  const copy = useCopy(language);
  const items = itemsFrom(payload.data).slice(0, fullscreen ? 12 : 8);
  if (!items.length) return <StateView kind="empty" language={language} />;
  return (
    <section className="suggestions-view">
      <header className="section-heading">
        <div><p className="eyebrow">{copy.toolResult}</p><h1>{copy.candidates}</h1></div>
        <Badge color="success" variant="soft" size="md">{items.length}</Badge>
      </header>
      <div className={fullscreen ? "suggestion-grid" : "carousel"}>
        {items.map((item, index) => (
          <article className="result-card suggestion-card" key={`${String(item.slug ?? titleFor(item))}:${index}`}>
            <Media className="result-media" item={item} />
            <div className="result-copy"><strong>{titleFor(item)}</strong>{scientificFor(item) ? <em>{scientificFor(item)}</em> : null}<span>{summaryFor(item)}</span></div>
            <MetricGrid metrics={primaryMetrics(item, 3)} language={language} />
          </article>
        ))}
      </div>
      <ViewActions allowExpand={items.length > 4} fullscreen={fullscreen} followUpLabel={copy.askMore} language={language} />
      <p className="advisory">{copy.advisory}</p>
    </section>
  );
}

function HabitatView({ payload, language, fullscreen }: ViewProps) {
  const copy = useCopy(language);
  const data = asRecord(payload.data);
  const input = asRecord(data.input);
  const labels = {
    en: {
      animals: "Animals",
      co2: "CO₂",
      difficulty: "Difficulty",
      group: "Group",
      habitatSummary: "Recommended habitat for the supplied tank",
      intent: "Setup",
      light: "Light",
      volume: "Volume",
      water: "Water type",
    },
    it: {
      animals: "Animali",
      co2: "CO₂",
      difficulty: "Difficoltà",
      group: "Gruppo",
      habitatSummary: "Habitat consigliato per la vasca indicata",
      intent: "Allestimento",
      light: "Luce",
      volume: "Volume",
      water: "Tipo d'acqua",
    },
    es: {
      animals: "Animales",
      co2: "CO₂",
      difficulty: "Dificultad",
      group: "Grupo",
      habitatSummary: "Hábitat recomendado para el acuario indicado",
      intent: "Montaje",
      light: "Luz",
      volume: "Volumen",
      water: "Tipo de agua",
    },
  }[language];
  const enumLabels: Record<string, string> = {
    balanced: language === "it" ? "Bilanciata" : language === "es" ? "Equilibrada" : "Balanced",
    brackish: language === "it" ? "Salmastra" : language === "es" ? "Salobre" : "Brackish",
    community: language === "it" ? "Comunità" : language === "es" ? "Comunitario" : "Community",
    easy: language === "it" ? "Facile" : language === "es" ? "Fácil" : "Easy",
    excellent: language === "it" ? "Eccellente" : language === "es" ? "Excelente" : "Excellent",
    expert: language === "it" ? "Esperta" : language === "es" ? "Experta" : "Expert",
    freshwater: language === "it" ? "Dolce" : language === "es" ? "Dulce" : "Freshwater",
    good: language === "it" ? "Buona" : language === "es" ? "Buena" : "Good",
    high: language === "it" ? "Alta" : language === "es" ? "Alta" : "High",
    injected: language === "it" ? "Iniettata" : language === "es" ? "Inyectado" : "Injected",
    low: language === "it" ? "Bassa" : language === "es" ? "Baja" : "Low",
    marine: language === "it" ? "Marina" : language === "es" ? "Marina" : "Marine",
    medium: language === "it" ? "Media" : language === "es" ? "Media" : "Medium",
    none: language === "it" ? "Assente" : language === "es" ? "Sin CO₂" : "None",
    recommended: language === "it" ? "Consigliata" : language === "es" ? "Recomendada" : "Recommended",
    review: language === "it" ? "Da verificare" : language === "es" ? "Revisar" : "Review",
  };
  const asList = (value: unknown) => Array.isArray(value)
    ? value.map(asRecord).filter((item) => Object.keys(item).length > 0)
    : [];
  const formatValue = (value: unknown) => {
    const text = String(value ?? "").trim();
    if (!text) return "";
    if (/\d/.test(text)) return text;
    const normalized = text.toLowerCase().replaceAll("_", " ");
    return enumLabels[normalized] ?? normalized.replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase());
  };
  const reasonLabels: Record<string, string> = {
    co2Match: "CO₂",
    difficultyMatch: labels.difficulty,
    fertilizerMatch: language === "it" ? "Fertilizzante adatto" : language === "es" ? "Fertilizante adecuado" : "Suitable fertilizer",
    groupSize: labels.group,
    lightMatch: labels.light,
    volumeMatch: labels.volume,
    waterTypeMatch: language === "it" ? "Acqua compatibile" : language === "es" ? "Agua compatible" : "Water type matches",
  };
  const reasonFor = (item: DataRecord) => String(item.reason ?? "")
    .split(";")
    .map((part) => {
      const [key, ...rawValue] = part.trim().split(":");
      const value = rawValue.join(":").trim();
      const knownLabel = reasonLabels[key ?? ""];
      if (!knownLabel && language !== "en") return "";
      const label = knownLabel ?? formatValue(key);
      return value ? `${label}: ${formatValue(value)}` : label;
    })
    .filter(Boolean)
    .slice(0, 4)
    .join(" · ");
  const fish = asList(data.fish);
  const invertebrates = asList(data.invertebrates);
  const allAnimals = [...fish, ...invertebrates];
  const allPlants = asList(data.plants);
  const allProducts = asList(data.products);
  const allGuides = asList(data.guides);
  const animals = allAnimals.slice(0, fullscreen ? 12 : 4);
  const plants = allPlants.slice(0, fullscreen ? 12 : 4);
  const products = allProducts.slice(0, fullscreen ? 8 : 3);
  const guides = allGuides.slice(0, fullscreen ? 8 : 4);
  const localizedHabitatText = (value: string) => {
    const translations = {
      it: {
        "Verify dose against plant response": "Verifica il dosaggio in base alla risposta delle piante",
        "Suitable gentle circulation": "Circolazione delicata adatta",
      },
      es: {
        "Verify dose against plant response": "Comprueba la dosis según la respuesta de las plantas",
        "Suitable gentle circulation": "Circulación suave adecuada",
      },
    } as const;
    return language === "en" ? value : translations[language][value as keyof typeof translations[typeof language]] ?? value;
  };
  const warnings = [...new Set([
    ...stringList(data.warnings),
    ...stringList(data.issues),
    ...allAnimals.flatMap((item) => stringList(item.warnings)),
    ...allPlants.flatMap((item) => stringList(item.warnings)),
    ...allProducts.flatMap((item) => stringList(item.warnings)),
  ].map((warning) => localizedHabitatText(warning.replace(/^[a-z]+Warning:\s*/i, ""))))].slice(0, fullscreen ? 12 : 3);
  const volume = input.volumeLiters ?? input.volume_liters ?? input.tank_liters;
  const temperature = input.temperatureC ?? input.temperature_c ?? input.temperature;
  const kpis = [
    volume !== undefined && volume !== null ? { label: labels.volume, value: `${String(volume)} L` } : undefined,
    input.waterType ? { label: labels.water, value: formatValue(input.waterType) } : undefined,
    temperature !== undefined && temperature !== null ? { label: copy.metricLabel("Temperature"), value: `${String(temperature)} °C` } : undefined,
    input.lightLevel ? { label: labels.light, value: formatValue(input.lightLevel) } : undefined,
    input.co2 ? { label: labels.co2, value: formatValue(input.co2) } : undefined,
    input.setupIntent ? { label: labels.intent, value: formatValue(input.setupIntent) } : undefined,
    input.targetDifficulty ? { label: labels.difficulty, value: formatValue(input.targetDifficulty) } : undefined,
  ].filter((metric): metric is { label: string; value: string } => Boolean(metric));
  return (
    <article className={fullscreen ? "habitat-view is-fullscreen" : "habitat-view"}>
      <header className="habitat-heading">
        <p className="eyebrow">{copy.habitatPlan}</p>
        <h1>{language === "en" ? String(data.title ?? data.name ?? copy.habitatPlan) : copy.habitatPlan}</h1>
        <p className="lede">{language === "en" ? summaryFor(data) || labels.habitatSummary : labels.habitatSummary}</p>
      </header>
      {kpis.length ? (
        <dl className="habitat-kpis">
          {kpis.slice(0, fullscreen ? 6 : 4).map((metric) => (
            <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>
          ))}
        </dl>
      ) : null}
      {animals.length ? (
        <section className="habitat-section">
          <div className="habitat-section-heading"><h2>{labels.animals}</h2><Badge color="info" variant="soft" size="md">{allAnimals.length}</Badge></div>
          <div className="habitat-animal-grid">
            {animals.map((item) => {
              const media = imageFor(item);
              const tier = String(item.tier ?? item.fit_status ?? "");
              const score = typeof item.score === "number" ? item.score : undefined;
              return (
                <div className={media ? "habitat-animal has-media" : "habitat-animal"} key={String(item.slug ?? titleFor(item))}>
                  {media ? <Media className="habitat-animal-media" item={item} /> : null}
                  <div className="habitat-item-copy">
                    <div className="habitat-item-title"><strong>{titleFor(item)}</strong>{tier ? <Badge color={/caution|review/i.test(tier) ? "warning" : "success"} variant="soft" size="sm">{score === undefined ? formatValue(tier) : `${formatValue(tier)} · ${score}`}</Badge> : null}</div>
                    {scientificFor(item) ? <em>{scientificFor(item)}</em> : null}
                    {reasonFor(item) ? <span>{reasonFor(item)}</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
      {plants.length ? (
        <section className="habitat-section">
          <div className="habitat-section-heading"><h2>{copy.plants}</h2><Badge color="success" variant="soft" size="md">{allPlants.length}</Badge></div>
          <div className="habitat-plant-grid">
            {plants.map((item) => {
              const media = imageFor(item);
              return (
                <div className={media ? "habitat-plant has-media" : "habitat-plant"} key={String(item.slug ?? titleFor(item))}>
                  {media ? <Media className="habitat-plant-media" item={item} /> : null}
                  <div className="habitat-item-copy"><strong>{titleFor(item)}</strong>{reasonFor(item) ? <span>{reasonFor(item)}</span> : null}</div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
      {products.length ? (
        <section className="habitat-section">
          <div className="habitat-section-heading"><h2>{copy.products}</h2><Badge color="info" variant="soft" size="md">{allProducts.length}</Badge></div>
          <div className="habitat-product-grid">
            {products.map((item, index) => (
              <div className="habitat-product" key={`${String(item.public_url ?? titleFor(item))}:${index}`}>
                <BrandMark item={item} compact />
                <strong>{titleFor(item)}</strong>
                {reasonFor(item) ? <span>{reasonFor(item)}</span> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {guides.length ? (
        <section className="habitat-section">
          <div className="habitat-section-heading"><h2>{copy.guidesSection}</h2></div>
          <div className="habitat-guide-list">
            {guides.map((item, index) => {
              const slug = String(item.slug ?? titleFor(item));
              const slugLabel = slug.split("/").at(-1) ?? slug;
              const label = slugLabel.replaceAll("-", " ");
              const localized = {
                "cycling-a-planted-aquarium": language === "it" ? "Avvio di un acquario piantumato" : language === "es" ? "Puesta en marcha de un acuario plantado" : "Cycling a planted aquarium",
                "managing-nitrate": language === "it" ? "Gestione dei nitrati" : language === "es" ? "Gestión de nitratos" : "Managing nitrate",
                ph: "pH",
                products: language === "it" ? "Prodotti" : language === "es" ? "Productos" : "Products",
                regimes: language === "it" ? "Regimi" : language === "es" ? "Regímenes" : "Regimes",
                temperature: language === "it" ? "Temperatura" : language === "es" ? "Temperatura" : "Temperature",
              }[slugLabel] ?? formatValue(label);
              return <span key={`${slug}:${index}`}>{localized}</span>;
            })}
          </div>
        </section>
      ) : null}
      <NoticeList title={copy.watchPoints} values={warnings} tone="warning" />
      <ViewActions allowExpand fullscreen={fullscreen} followUp={copy.habitatFollowUp} followUpLabel={copy.askMore} language={language} />
      <p className="advisory">{copy.advisory}</p>
    </article>
  );
}

type DiagnosticBlock = { heading?: string; items: string[] };

function diagnosticInlineText(value: unknown) {
  return String(value ?? "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function diagnosticBlocks(value: unknown): DiagnosticBlock[] {
  const values = Array.isArray(value)
    ? value.map((entry) => typeof entry === "string" ? entry : summaryFor(asRecord(entry)) || titleFor(asRecord(entry)))
    : typeof value === "string"
      ? [value]
      : [];
  const blocks: DiagnosticBlock[] = [];

  for (const source of values) {
    let current: DiagnosticBlock = { items: [] };
    const push = () => {
      if (current.heading || current.items.length) blocks.push(current);
    };
    const lines = source
      .replace(/\r/g, "")
      .replace(/\s+(?=#{1,6}\s+)/g, "\n")
      .replace(/\s+(?=(?:[-+*]|\d+[.)])\s+)/g, "\n")
      .split(/\n+/);

    for (const rawLine of lines) {
      const heading = rawLine.match(/^\s*#{1,6}\s+(.+?)\s*$/);
      if (heading) {
        push();
        current = { heading: diagnosticInlineText(heading[1]), items: [] };
        continue;
      }
      const text = diagnosticInlineText(rawLine.replace(/^\s*(?:[-+*]|\d+[.)])\s+/, ""));
      if (text) current.items.push(text);
    }
    push();
  }

  return blocks;
}

function DiagnosticView({ payload, language, fullscreen }: ViewProps) {
  const copy = useCopy(language);
  const item = asRecord(itemsFrom(payload.data)[0] ?? payload.data);
  if (!Object.keys(item).length) return <StateView kind="empty" language={language} />;
  const labels = {
    en: {
      activeIngredients: "Active ingredients",
      chemicalData: "Chemical data",
      contagious: "Contagious",
      difficulty: "Difficulty",
      dosage: "Dosage",
      formula: "Formula",
      indications: "Indications",
      leaflet: "Leaflet summary",
      molarMass: "Molar mass",
      mortality: "Mortality",
      no: "No",
      overview: "Overview",
      related: "Related profiles",
      safety: "Safety notes",
      type: "Type",
      water: "Water type",
      yes: "Yes",
    },
    it: {
      activeIngredients: "Principi attivi",
      chemicalData: "Dati chimici",
      contagious: "Contagiosa",
      difficulty: "Difficoltà",
      dosage: "Dosaggio",
      formula: "Formula",
      indications: "Indicazioni",
      leaflet: "Sintesi del foglietto",
      molarMass: "Massa molare",
      mortality: "Mortalità",
      no: "No",
      overview: "Panoramica",
      related: "Profili correlati",
      safety: "Note di sicurezza",
      type: "Tipo",
      water: "Tipo d'acqua",
      yes: "Sì",
    },
    es: {
      activeIngredients: "Principios activos",
      chemicalData: "Datos químicos",
      contagious: "Contagiosa",
      difficulty: "Dificultad",
      dosage: "Dosis",
      formula: "Fórmula",
      indications: "Indicaciones",
      leaflet: "Resumen del prospecto",
      molarMass: "Masa molar",
      mortality: "Mortalidad",
      no: "No",
      overview: "Resumen",
      related: "Perfiles relacionados",
      safety: "Notas de seguridad",
      type: "Tipo",
      water: "Tipo de agua",
      yes: "Sí",
    },
  }[language];
  const heroSource = item.short_description ?? item.summary ?? item.description;
  const heroSummary = diagnosticInlineText(heroSource);
  const hasMedia = Boolean(imageFor(item));
  const statusMetrics: Metric[] = [];
  const addMetric = (label: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;
    const display = typeof value === "boolean"
      ? value ? labels.yes : labels.no
      : Array.isArray(value)
        ? value.map((entry) => copy.statusLabel(String(entry))).join(" · ")
        : copy.statusLabel(String(value));
    statusMetrics.push({ label, value: display });
  };
  addMetric(labels.type, item.type);
  addMetric(labels.difficulty, item.difficulty);
  addMetric(labels.contagious, item.contagious);
  addMetric(labels.mortality, item.mortality_rate);
  addMetric(labels.water, item.water_types);

  const content = [
    { id: "overview", title: labels.overview, value: item.short_description ? item.description : undefined },
    { id: "symptoms", title: copy.symptoms, value: item.symptoms, tone: "warning" },
    { id: "causes", title: copy.likelyCauses, value: item.causes ?? item.likely_causes },
    { id: "treatment", title: copy.treatment, value: item.treatments ?? item.treatment ?? item.recommended_actions },
    { id: "prevention", title: copy.prevention, value: item.prevention },
    { id: "indications", title: labels.indications, value: item.indications },
    { id: "dosage", title: labels.dosage, value: item.dosage },
    { id: "safety", title: labels.safety, value: item.safety_notes, tone: "warning" },
    { id: "leaflet", title: labels.leaflet, value: item.leaflet_summary },
    { id: "ingredients", title: labels.activeIngredients, value: item.active_ingredients },
  ].map((section) => ({ ...section, blocks: diagnosticBlocks(section.value) }))
    .filter((section) => section.blocks.length)
    .slice(0, fullscreen ? 12 : 6);
  const chemical = asRecord(item.chemical_data);
  const chemicalMetrics: Metric[] = [];
  if (chemical.formula) chemicalMetrics.push({ label: labels.formula, value: String(chemical.formula) });
  if (chemical.molarMass ?? chemical.molar_mass) chemicalMetrics.push({ label: labels.molarMass, value: String(chemical.molarMass ?? chemical.molar_mass) });
  const chemicalDescription = diagnosticInlineText(chemical.description);
  const relatedGroups = [item.medicines, item.diseases, item.plant_problems, item.fertilizers]
    .flatMap((value) => Array.isArray(value) ? value.map(asRecord) : [])
    .filter((entry) => Object.keys(entry).length)
    .slice(0, fullscreen ? 12 : 6);

  return (
    <article className={`diagnostic-view${fullscreen ? " is-fullscreen" : ""}`}>
      <header className={`diagnostic-hero${hasMedia ? " has-media" : ""}`}>
        {hasMedia ? <div className="profile-visual"><Media item={item} /></div> : null}
        <div className="diagnostic-summary">
          <p className="eyebrow">{copy.diagnosticProfile}</p>
          <h1>{titleFor(item)}</h1>
          {scientificFor(item) ? <p className="scientific">{scientificFor(item)}</p> : null}
          {heroSummary ? <p className="lede">{heroSummary}</p> : null}
          <MetricGrid metrics={statusMetrics.slice(0, fullscreen ? 5 : 4)} language={language} />
        </div>
      </header>
      {content.length ? (
        <div className="diagnostic-sections">
          {content.map((section) => (
            <section className={`diagnostic-section${section.tone === "warning" ? " is-warning" : ""}`} key={section.id}>
              <h2>{section.title}</h2>
              {section.blocks.slice(0, fullscreen ? 10 : 4).map((block, index) => (
                <div className="diagnostic-block" key={`${block.heading ?? section.title}:${index}`}>
                  {block.heading && block.heading.localeCompare(section.title, undefined, { sensitivity: "base" }) !== 0
                    ? <h3>{block.heading}</h3>
                    : null}
                  {block.items.length === 1 ? <p>{block.items[0]}</p> : (
                    <ul>{block.items.slice(0, fullscreen ? 12 : 5).map((entry) => <li key={entry}>{entry}</li>)}</ul>
                  )}
                </div>
              ))}
            </section>
          ))}
          {chemicalMetrics.length || chemicalDescription ? (
            <section className="diagnostic-section">
              <h2>{labels.chemicalData}</h2>
              <MetricGrid metrics={chemicalMetrics} language={language} />
              {chemicalDescription ? <p>{chemicalDescription}</p> : null}
            </section>
          ) : null}
        </div>
      ) : null}
      {relatedGroups.length ? (
        <section className="diagnostic-related">
          <h2>{labels.related}</h2>
          <div>{relatedGroups.map((entry, index) => <span key={`${String(entry.slug ?? titleFor(entry))}:${index}`}>{titleFor(entry)}</span>)}</div>
        </section>
      ) : null}
      <ViewActions allowExpand fullscreen={fullscreen} followUp={copy.diagnosticFollowUp(titleFor(item))} followUpLabel={copy.askMore} language={language} />
      <p className="advisory">{copy.advisory}</p>
    </article>
  );
}

function CalculationView({ payload, language, fertilization = false }: ViewProps & { fertilization?: boolean }) {
  const copy = useCopy(language);
  const data = asRecord(payload.data);
  const presentation = normalizeCalculationPresentation(payload.tool, data);
  const formatMetric = (metric: CalculationMetric): Metric => ({
    label: metric.label,
    value: `${typeof metric.value === "boolean"
      ? metric.value
        ? language === "it" ? "Sì" : language === "es" ? "Sí" : "Yes"
        : language === "it" ? "No" : language === "es" ? "No" : "No"
      : typeof metric.value === "string"
        ? copy.statusLabel(metric.value)
        : String(metric.value)}${metric.unit ? ` ${metric.unit}` : ""}`,
  });

  if (presentation && presentation.state !== "ready") {
    return (
      <section className="state-view calculation-empty" data-state={presentation.state}>
        <MascotAccent character="chameleon" language={language} />
        <div className="state-copy">
          <p className="eyebrow">{fertilization ? copy.fertilization : copy.calculatedResult}</p>
          <h1>{copy.metricLabel(presentation.title)}</h1>
          <p>{copy.incompleteCalculation}</p>
          {presentation.highlights.length ? (
            <MetricGrid metrics={presentation.highlights.map(formatMetric)} language={language} />
          ) : null}
        </div>
      </section>
    );
  }

  if (presentation?.hero) {
    const hero = presentation.hero;
    return (
      <article className={`calculation-view${fertilization ? " is-fertilization" : ""}`}>
        <header>
          <p className="eyebrow">{fertilization ? copy.fertilization : copy.calculatedResult}</p>
          <h1>{copy.metricLabel(presentation.title)}</h1>
          <p className="calculation-value">
            <strong>{typeof hero.value === "string" ? copy.statusLabel(hero.value) : String(hero.value)}{hero.unit ? <small>{hero.unit}</small> : null}</strong>
            <span>{copy.metricLabel(hero.label)}</span>
          </p>
          {presentation.highlights.length ? (
            <MetricGrid metrics={presentation.highlights.map(formatMetric)} language={language} />
          ) : null}
        </header>
        {presentation.sections.map((section) => (
          <section className="calculation-section" key={section.id}>
            <h2>{copy.metricLabel(section.title)}</h2>
            {section.metrics?.length ? (
              <MetricGrid metrics={section.metrics.map(formatMetric)} language={language} />
            ) : null}
            {section.rows?.length ? (
              <div className="calculation-rows">
                {section.rows.map((row, index) => (
                  <article className="calculation-row" key={`${row.label}:${index}`}>
                    <header>
                      <div>
                        <strong>{row.label}</strong>
                        {row.detail ? <span>{row.detail}</span> : null}
                      </div>
                      {row.status ? (
                        <Badge color={/above|below|missing|partial/i.test(row.status) ? "warning" : "success"} variant="soft" size="sm">
                          {copy.statusLabel(row.status)}
                        </Badge>
                      ) : null}
                    </header>
                    <MetricGrid metrics={row.metrics.map(formatMetric)} language={language} />
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        ))}
        <p className="advisory">{copy.calculationAdvisory}</p>
      </article>
    );
  }

  const metrics = genericMetrics(data, 10);
  const primary = metrics[0];
  const remaining = metrics.slice(1);
  return (
    <article className="calculation-view">
      <header>
        <p className="eyebrow">{fertilization ? copy.fertilization : copy.calculatedResult}</p>
        <h1>{String(data.title ?? data.name ?? primary?.label ?? copy.calculatedResult)}</h1>
        {primary ? <p className="calculation-value"><strong>{primary.value}</strong><span>{copy.metricLabel(primary.label)}</span></p> : null}
        {summaryFor(data) ? <p className="lede">{summaryFor(data)}</p> : null}
      </header>
      <section><h2 className="subheading">{copy.inputsAndAssumptions}</h2><MetricGrid metrics={remaining.slice(0, 8)} language={language} /></section>
      <p className="advisory">{copy.calculationAdvisory}</p>
    </article>
  );
}

function ResultView(props: ViewProps) {
  const kind = viewKind(props.payload.tool);
  if (kind === "collection") return <CollectionView {...props} />;
  if (kind === "product") return <ProductProfileView {...props} />;
  if (kind === "compatibility") return <CompatibilityView {...props} />;
  if (kind === "suggestions") return <SuggestionsView {...props} />;
  if (kind === "habitat") return <HabitatView {...props} />;
  if (kind === "diagnostic") return <DiagnosticView {...props} />;
  if (kind === "fertilization") return <CalculationView {...props} fertilization />;
  if (kind === "calculator") return <CalculationView {...props} />;
  return <ProfileView {...props} />;
}

export function App() {
  const host = useOpenAiHost();
  const payloadData = asRecord(host.payload?.data);
  const payloadLanguage = payloadData.language_used ?? payloadData.language ?? payloadData.locale;
  const language = languageFrom(host.payload?.language ?? payloadLanguage ?? host.locale);
  const safe = host.safeArea?.insets ?? host.safeArea ?? {};
  const style = useMemo(
    () => ({
      "--safe-top": `${safe.top ?? 0}px`,
      "--safe-right": `${safe.right ?? 0}px`,
      "--safe-bottom": `${safe.bottom ?? 0}px`,
      "--safe-left": `${safe.left ?? 0}px`,
      "--host-max-height": host.maxHeight ? `${host.maxHeight}px` : "none",
    }) as React.CSSProperties,
    [host.maxHeight, safe.bottom, safe.left, safe.right, safe.top],
  );

  return (
    <AppsSDKUIProvider linkComponent="a">
      <main className="app-shell" data-theme={host.theme} data-display-mode={host.displayMode} style={style}>
        {!host.payload ? (
          <StateView kind="waiting" language={language} />
        ) : host.payload.isError ? (
          <StateView kind="error" language={language} />
        ) : (
          <ResultView payload={host.payload} language={language} fullscreen={host.displayMode === "fullscreen"} />
        )}
      </main>
    </AppsSDKUIProvider>
  );
}
