import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Image } from "@openai/apps-sdk-ui/components/Image";
import { ShimmerText } from "@openai/apps-sdk-ui/components/ShimmerText";
import { useEffect, useMemo, useState } from "react";

import mascotScene from "../assets/atlarium-mcp-mascots.webp";
import {
  callTool,
  canRequestDisplayMode,
  persistWidgetState,
  requestDisplayMode,
  sendFollowUp,
  useOpenAiHost,
} from "./bridge";
import { languageFrom, useCopy } from "./copy";
import {
  asRecord,
  detailToolFor,
  genericMetrics,
  imageFor,
  itemsFrom,
  primaryMetrics,
  scientificFor,
  stringList,
  summaryFor,
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

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  if (!metrics.length) return null;
  return (
    <dl className="metric-grid">
      {metrics.map((metric) => (
        <div className="metric" key={`${metric.label}:${metric.value}`}>
          <dt>{metric.label}</dt>
          <dd>{metric.value}</dd>
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

function MascotMedia({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "mascot-media mascot-media--compact" : "mascot-media"}>
      <img
        src={mascotScene}
        alt="Atlarium's orange chameleon and blue fish connecting two habitat laboratories"
      />
    </div>
  );
}

function ViewActions({
  allowExpand,
  fullscreen,
  followUp,
  followUpLabel,
}: {
  allowExpand: boolean;
  fullscreen: boolean;
  followUp?: string;
  followUpLabel: string;
}) {
  const copy = useCopy(languageFrom(window.openai?.locale));
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
      <MascotMedia />
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
  const items = itemsFrom(payload.data).slice(0, 8);
  const restoredIndex = Number(window.openai?.widgetState?.selectedIndex ?? 0);
  const [selectedIndex, setSelectedIndex] = useState(
    Number.isInteger(restoredIndex) && restoredIndex >= 0 && restoredIndex < items.length ? restoredIndex : 0,
  );
  const detailTool = detailToolFor(payload.tool);

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
          return (
            <article className={selected ? "result-card is-selected" : "result-card"} key={`${slug}:${index}`}>
              <button
                className="result-select"
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setSelectedIndex(index);
                  persistWidgetState({ selectedIndex: index, tool: payload.tool });
                }}
              >
                <Media className="result-media" item={item} />
                <span className="result-copy">
                  <strong>{titleFor(item)}</strong>
                  {scientificFor(item) ? <em>{scientificFor(item)}</em> : null}
                  <span>{summaryFor(item)}</span>
                </span>
              </button>
              <MetricGrid metrics={primaryMetrics(item, 3)} />
              {detailTool && slug ? (
                <Button
                  color="secondary"
                  variant="outline"
                  size="md"
                  block
                  onClick={() => void callTool(detailTool, { slug, language })}
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
  const followUp = `Explain the most important care implications for ${titleFor(item)} using the Atlarium result above.`;
  const metrics = fullscreen ? [...primaryMetrics(item, 6), ...genericMetrics(item, 6)].slice(0, 8) : primaryMetrics(item, 4);
  return (
    <article className="profile-view">
      <div className="profile-visual">
        <Media item={item} />
      </div>
      <div className="profile-copy">
        <p className="eyebrow">{copy.toolResult}</p>
        <h1>{titleFor(item)}</h1>
        {scientificFor(item) ? <p className="scientific">{scientificFor(item)}</p> : null}
        {summaryFor(item) ? <p className="lede">{summaryFor(item)}</p> : null}
        <MetricGrid metrics={metrics} />
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
  const summary = summaryFor(data);
  const warnings = [...stringList(data.warnings), ...stringList(data.issues)];
  const actions = stringList(data.recommended_actions);
  return (
    <article className="compatibility-view">
      <header className="verdict">
        <div>
          <p className="eyebrow">{copy.compatibility}</p>
          <h1>{level.replaceAll("_", " ")}</h1>
          {summary ? <p className="lede">{summary}</p> : null}
        </div>
        <Badge color={/incompatible|avoid|risk/i.test(level) ? "warning" : "success"} variant="soft" size="lg">
          {level.replaceAll("_", " ")}
        </Badge>
      </header>
      {profiles.length ? (
        <section>
          <h2 className="subheading">{copy.speciesReviewed}</h2>
          <div className="species-pair">
            {profiles.slice(0, fullscreen ? 8 : 2).map((profile) => (
              <div className="species-row" key={String(profile.slug ?? titleFor(profile))}>
                <Media className="species-avatar" item={profile} />
                <div><strong>{titleFor(profile)}</strong><span>{scientificFor(profile)}</span></div>
                <MetricGrid metrics={primaryMetrics(profile, 2)} />
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
        followUp={`Explain how to manage this compatibility result safely: ${level}.`}
        followUpLabel={copy.askMore}
      />
      <p className="advisory">{String(data.disclaimer ?? copy.advisory)}</p>
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
            <MetricGrid metrics={primaryMetrics(item, 3)} />
          </article>
        ))}
      </div>
      <ViewActions allowExpand={items.length > 4} fullscreen={fullscreen} followUpLabel={copy.askMore} />
      <p className="advisory">{copy.advisory}</p>
    </section>
  );
}

function HabitatView({ payload, language, fullscreen }: ViewProps) {
  const copy = useCopy(language);
  const data = asRecord(payload.data);
  const candidates = itemsFrom(data.species ?? data.suggestions ?? data.results).slice(0, fullscreen ? 12 : 6);
  const sections = [
    [copy.plants, data.plants],
    [copy.products, data.products ?? data.equipment],
    [copy.guidesSection, data.guides],
  ] as const;
  return (
    <article className="habitat-view">
      <MascotMedia />
      <header className="habitat-heading">
        <p className="eyebrow">{copy.habitatPlan}</p>
        <h1>{String(data.title ?? data.name ?? copy.habitatPlan)}</h1>
        {summaryFor(data) ? <p className="lede">{summaryFor(data)}</p> : null}
      </header>
      {candidates.length ? (
        <section><h2 className="subheading">{copy.candidates}</h2><div className="habitat-list">{candidates.map((item) => <div className="habitat-row" key={String(item.slug ?? titleFor(item))}><strong>{titleFor(item)}</strong><span>{summaryFor(item)}</span></div>)}</div></section>
      ) : null}
      {sections.map(([title, value]) => {
        const items = Array.isArray(value) ? value.map(asRecord) : [];
        if (!items.length) return null;
        return <section key={title}><h2 className="subheading">{title}</h2><div className="compact-list">{items.slice(0, fullscreen ? 12 : 4).map((item) => <span key={String(item.slug ?? titleFor(item))}>{titleFor(item)}</span>)}</div></section>;
      })}
      <NoticeList title={copy.watchPoints} values={[...stringList(data.warnings), ...stringList(data.issues)]} tone="warning" />
      <ViewActions allowExpand fullscreen={fullscreen} followUp={`Refine this Atlarium habitat plan while keeping it read-only.`} followUpLabel={copy.askMore} />
      <p className="advisory">{copy.advisory}</p>
    </article>
  );
}

function DiagnosticView({ payload, language, fullscreen }: ViewProps) {
  const copy = useCopy(language);
  const item = asRecord(itemsFrom(payload.data)[0] ?? payload.data);
  const sections = [
    [copy.symptoms, item.symptoms],
    [copy.likelyCauses, item.causes ?? item.likely_causes],
    [copy.treatment, item.treatment ?? item.recommended_actions],
    [copy.prevention, item.prevention],
  ] as const;
  return (
    <article className="diagnostic-view">
      <div className="profile-visual"><Media item={item} /></div>
      <div className="profile-copy">
        <p className="eyebrow">{copy.diagnosticProfile}</p><h1>{titleFor(item)}</h1>
        {summaryFor(item) ? <p className="lede">{summaryFor(item)}</p> : null}
        {sections.map(([title, value], index) => <NoticeList key={title} title={title} values={stringList(value).slice(0, fullscreen ? 12 : 4)} tone={index === 0 ? "warning" : "default"} />)}
        <ViewActions allowExpand fullscreen={fullscreen} followUp={`Explain the safest next checks for this Atlarium diagnostic result: ${titleFor(item)}.`} followUpLabel={copy.askMore} />
        <p className="advisory">{copy.advisory}</p>
      </div>
    </article>
  );
}

function CalculationView({ payload, language, fertilization = false }: ViewProps & { fertilization?: boolean }) {
  const copy = useCopy(language);
  const data = asRecord(payload.data);
  const metrics = genericMetrics(data, 10);
  const primary = metrics[0];
  const remaining = metrics.slice(1);
  return (
    <article className="calculation-view">
      <header>
        <p className="eyebrow">{fertilization ? copy.fertilization : copy.calculatedResult}</p>
        <h1>{String(data.title ?? data.name ?? primary?.label ?? copy.calculatedResult)}</h1>
        {primary ? <p className="calculation-value"><strong>{primary.value}</strong><span>{primary.label}</span></p> : null}
        {summaryFor(data) ? <p className="lede">{summaryFor(data)}</p> : null}
      </header>
      <section><h2 className="subheading">{copy.inputsAndAssumptions}</h2><MetricGrid metrics={remaining.slice(0, 8)} /></section>
      {fertilization ? <MascotMedia compact /> : null}
      <p className="advisory">{String(data.disclaimer ?? copy.advisory)}</p>
    </article>
  );
}

function ResultView(props: ViewProps) {
  const kind = viewKind(props.payload.tool);
  if (kind === "collection") return <CollectionView {...props} />;
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
  const payloadLanguage = asRecord(host.payload?.data).language ?? asRecord(host.payload?.data).locale;
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
