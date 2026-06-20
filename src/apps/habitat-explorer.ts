export const habitatExplorerResourceUri = "ui://widget/habitat-explorer.v1.html";
export const habitatExplorerMimeType = "text/html;profile=mcp-app";

export const habitatExplorerToolMeta = {
  ui: {
    resourceUri: habitatExplorerResourceUri,
  },
  "openai/outputTemplate": habitatExplorerResourceUri,
} satisfies Record<string, unknown>;

export const habitatExplorerResourceMeta = {
  title: "Atlarium Habitat Explorer",
  description:
    "Interactive read-only habitat cards for species, plants, compatibility and tank suggestions.",
  mimeType: habitatExplorerMimeType,
  _meta: {
    ui: {
      csp: {
        connectDomains: [],
        resourceDomains: [],
        frameDomains: [],
      },
      widgetDescription:
        "Render Atlarium habitat data as searchable cards, profile panels and compatibility summaries.",
    },
    "openai/widgetDescription":
      "Render Atlarium habitat data as searchable cards, profile panels and compatibility summaries.",
    "openai/widgetPrefersBorder": false,
    "openai/widgetCSP": {
      connect_domains: [],
      resource_domains: [],
      frame_domains: [],
    },
  },
};

const ATLARIUM_LOGO_DARK_JPEG =
  "data:image/jpeg;base64,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";
const ATLARIUM_LOGO_LIGHT_JPEG =
  "data:image/jpeg;base64,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";

export function habitatExplorerHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Atlarium Habitat Explorer</title>
  <style>
    :root {
      color-scheme: light dark;
      --deep-blue: #0a1628;
      --ocean: #0e4d92;
      --azure: #1a8fe3;
      --lagoon: #0b6fa8;
      --aqua: #64e8d6;
      --plant: #22a65e;
      --plant-deep: #0d5c3a;
      --paper: #f6f9fb;
      --surface: #f0f6fa;
      --surface-raised: #ffffff;
      --ink: #0b1a2e;
      --muted: #5a7188;
      --line: #c8d8e4;
      --foam: #e0eef6;
      --coral: #e85d3a;
      --amber: #d4952e;
      --bg: radial-gradient(ellipse at 18% 0%, rgb(26 143 227 / 0.12), transparent 34rem),
        radial-gradient(ellipse at 82% 6%, rgb(34 166 94 / 0.09), transparent 28rem),
        linear-gradient(180deg, var(--paper) 0%, #e6eef5 100%);
      --panel: rgb(255 255 255 / 0.84);
      --panel-solid: #ffffff;
      --soft: rgb(26 143 227 / 0.08);
      --accent: var(--azure);
      --accent-ink: #ffffff;
      --warn: var(--amber);
      --shadow: rgb(10 22 40 / 0.08);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --deep-blue: #060e1a;
        --ocean: #1565c0;
        --azure: #42a5f5;
        --lagoon: #4fc3f7;
        --aqua: #80ffea;
        --plant: #66d492;
        --plant-deep: #2e8b57;
        --paper: #0c1524;
        --surface: #111d30;
        --surface-raised: #142238;
        --ink: #e8f0f8;
        --muted: #8da4bd;
        --line: #1c2e42;
        --foam: #0f1e2f;
        --coral: #f08a70;
        --amber: #e2bd74;
        --bg: radial-gradient(ellipse at 18% 8%, rgb(21 101 192 / 0.18), transparent 32rem),
          radial-gradient(ellipse at 84% 12%, rgb(34 166 94 / 0.11), transparent 28rem),
          linear-gradient(180deg, var(--paper) 0%, #070d16 100%);
        --panel: rgb(17 29 48 / 0.78);
        --panel-solid: #111d30;
        --soft: rgb(100 232 214 / 0.09);
        --accent: var(--aqua);
        --accent-ink: #06101a;
        --warn: var(--amber);
        --shadow: rgb(0 0 0 / 0.24);
      }
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-size: 14px;
      line-height: 1.45;
      overflow-x: hidden;
    }

    button, input {
      font: inherit;
    }

    button {
      -webkit-tap-highlight-color: transparent;
    }

    .shell {
      min-height: 100vh;
      padding: 16px;
      display: grid;
      grid-template-rows: auto auto 1fr;
      gap: 12px;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand-lockup {
      display: flex;
      align-items: center;
      min-width: 0;
      gap: 10px;
    }

    .brand-logo-frame {
      width: 48px;
      height: 48px;
      flex: 0 0 auto;
      border-radius: 12px;
      overflow: hidden;
      background: var(--surface-raised);
      box-shadow: 0 10px 24px var(--shadow);
    }

    .brand-logo {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .brand-logo.dark {
      display: none;
    }

    @media (prefers-color-scheme: dark) {
      .brand-logo.light {
        display: none;
      }

      .brand-logo.dark {
        display: block;
      }
    }

    .brand-copy {
      min-width: 0;
    }

    h1 {
      margin: 0;
      font-size: 20px;
      line-height: 1.15;
      letter-spacing: 0;
    }

    .status {
      color: var(--muted);
      font-size: 12px;
      margin-top: 3px;
    }

    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: flex-end;
    }

    .tab, .action {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--surface-raised);
      color: var(--ink);
      cursor: pointer;
      min-height: 32px;
      max-width: 100%;
      padding: 7px 11px;
      white-space: normal;
      transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
    }

    .tab:hover, .action:hover {
      transform: translateY(-1px);
      border-color: var(--accent);
      box-shadow: 0 8px 18px var(--shadow);
    }

    .tab[aria-selected="true"], .action.primary {
      background: linear-gradient(135deg, var(--ocean), var(--azure));
      border-color: rgb(26 143 227 / 0.48);
      color: var(--accent-ink);
    }

    .action.primary {
      background: linear-gradient(135deg, var(--plant-deep), var(--plant));
    }

    .workspace {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
      gap: 12px;
      min-height: 0;
    }

    .pane {
      min-width: 0;
      overflow: hidden;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
      box-shadow: 0 18px 45px var(--shadow);
      backdrop-filter: blur(10px);
    }

    .controls {
      display: grid;
      gap: 10px;
    }

    .filter {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface-raised);
      color: var(--ink);
      min-height: 38px;
      padding: 8px 10px;
      outline: none;
      transition: border-color 160ms ease, box-shadow 160ms ease;
    }

    .filter:focus {
      border-color: var(--azure);
      box-shadow: 0 0 0 3px rgb(26 143 227 / 0.14);
    }

    .list {
      display: grid;
      gap: 8px;
      max-height: 56vh;
      overflow: auto;
      padding-right: 2px;
    }

    .item {
      width: 100%;
      min-width: 0;
      text-align: left;
      border: 1px solid var(--line);
      background: rgb(255 255 255 / 0.38);
      color: var(--ink);
      border-radius: 8px;
      padding: 11px;
      cursor: pointer;
      transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
    }

    .item:hover, .item.active {
      border-color: var(--accent);
      background: var(--soft);
      box-shadow: 0 10px 24px var(--shadow);
    }

    .item:hover {
      transform: translateY(-1px);
    }

    .item-title {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 10px;
      font-weight: 650;
      min-width: 0;
    }

    .latin {
      color: var(--muted);
      font-style: italic;
      font-size: 12px;
      text-align: right;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
      min-width: 0;
    }

    .chip {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgb(255 255 255 / 0.38);
      color: var(--muted);
      font-size: 11px;
      padding: 3px 7px;
      max-width: 100%;
      overflow-wrap: anywhere;
    }

    .chip.water { border-color: rgb(26 143 227 / 0.42); color: var(--azure); }
    .chip.plant { border-color: rgb(34 166 94 / 0.42); color: var(--plant); }
    .chip.warn { border-color: rgb(212 149 46 / 0.5); color: var(--warn); }

    .detail {
      min-height: 220px;
    }

    .detail h2 {
      font-size: 18px;
      margin: 0 0 4px;
      letter-spacing: 0;
    }

    .summary {
      color: var(--muted);
      margin: 0 0 12px;
    }

    .body-copy {
      margin: 0;
      color: var(--ink);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin: 12px 0;
    }

    .metric {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgb(255 255 255 / 0.32);
      padding: 9px;
    }

    .metric strong {
      display: block;
      font-size: 12px;
      color: var(--muted);
      font-weight: 500;
    }

    .metric span {
      display: block;
      margin-top: 2px;
      font-weight: 650;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
      min-width: 0;
    }

    .section-title {
      margin: 16px 0 8px;
      color: var(--muted);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .stack {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }

    .mini-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgb(255 255 255 / 0.28);
      padding: 9px;
    }

    .mini-card strong {
      display: block;
      margin-bottom: 2px;
    }

    .empty {
      color: var(--muted);
      border: 1px dashed var(--line);
      border-radius: 8px;
      padding: 18px;
      background: rgb(255 255 255 / 0.24);
    }

    .compat {
      border-left: 3px solid var(--accent);
      padding-left: 12px;
    }

    .warning {
      color: var(--warn);
      margin: 0;
    }

    .disclaimer {
      margin-top: 14px;
      color: var(--muted);
      font-size: 12px;
    }

    @media (max-width: 720px) {
      .shell { padding: 12px; }
      .topbar { display: grid; }
      .tabs { justify-content: flex-start; }
      .workspace { grid-template-columns: 1fr; }
      .list { max-height: 42vh; }
      .metrics { grid-template-columns: 1fr; }
    }

    @media (max-width: 460px) {
      .topbar { gap: 12px; }
      .brand-logo-frame { width: 44px; height: 44px; border-radius: 11px; }
      h1 { font-size: 19px; }
      .tabs { gap: 5px; }
      .tab { padding: 7px 10px; }
      .controls .actions {
        display: grid;
        grid-template-columns: 1fr;
      }
      .controls .action {
        width: 100%;
      }
      .item-title {
        align-items: flex-start;
        flex-direction: column;
        gap: 2px;
      }
      .latin {
        text-align: left;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <header class="topbar">
      <div class="brand-lockup">
        <span class="brand-logo-frame" data-brand-logo role="img" aria-label="Atlarium logo">
          <img class="brand-logo light" src="${ATLARIUM_LOGO_LIGHT_JPEG}" alt="" />
          <img class="brand-logo dark" src="${ATLARIUM_LOGO_DARK_JPEG}" alt="" />
        </span>
        <div class="brand-copy">
          <h1>Atlarium Habitat Explorer</h1>
          <div class="status" id="status">Waiting for Atlarium tool data</div>
        </div>
      </div>
      <nav class="tabs" aria-label="Habitat views">
        <button class="tab" data-tab="results" aria-selected="true">Results</button>
        <button class="tab" data-tab="profile" aria-selected="false">Profile</button>
        <button class="tab" data-tab="compatibility" aria-selected="false">Compatibility</button>
        <button class="tab" data-tab="suggestions" aria-selected="false">Suggestions</button>
      </nav>
    </header>

    <section class="pane controls">
      <input id="filter" class="filter" type="search" placeholder="Filter visible habitat data" />
      <div class="actions">
        <button class="action primary" data-tool="suggest_species_for_tank">Suggest 90 L planted tank</button>
        <button class="action" data-tool="check_species_compatibility">Check community pair</button>
      </div>
    </section>

    <section class="workspace">
      <div class="pane">
        <div class="list" id="list"></div>
      </div>
      <aside class="pane detail" id="detail"></aside>
    </section>
  </main>

  <script>
    (() => {
      const state = {
        tab: "results",
        filter: "",
        selectedIndex: 0,
        tool: "",
        data: null
      };

      const tabs = Array.from(document.querySelectorAll(".tab"));
      const list = document.getElementById("list");
      const detail = document.getElementById("detail");
      const filter = document.getElementById("filter");
      const status = document.getElementById("status");
      const openai = window.openai;
      let rpcId = 1;

      function asObject(value) {
        return value && typeof value === "object" && !Array.isArray(value) ? value : {};
      }

      function currentPayload(payload) {
        if (payload && typeof payload === "object" && "structuredContent" in payload) {
          return payload.structuredContent;
        }
        if (payload && typeof payload === "object" && "tool" in payload && "data" in payload) {
          return payload;
        }
        return { tool: "unknown", data: payload };
      }

      function receivePayload(payload) {
        const normalized = currentPayload(payload);
        state.tool = normalized.tool || "unknown";
        state.data = normalized.data ?? normalized;
        state.selectedIndex = 0;
        inferTab();
        render();
      }

      function inferTab() {
        if (/compatibility/i.test(state.tool)) state.tab = "compatibility";
        else if (/suggest/i.test(state.tool)) state.tab = "suggestions";
        else if (/profile|water/i.test(state.tool)) state.tab = "profile";
        else state.tab = "results";
      }

      function titleFor(item) {
        if (item.compatibility_level || Array.isArray(item.species_profiles)) return "Compatibility review";
        return item.common_name || item.name || item.title || item.slug || item.scientific_name || "Habitat item";
      }

      function scientificFor(item) {
        if (Array.isArray(item.species_profiles)) {
          return item.species_profiles.map((species) => titleFor(asObject(species))).join(" + ");
        }
        return item.scientific_name || item.latin_name || "";
      }

      function allItems() {
        const data = state.data;
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.results)) return data.results;
        if (Array.isArray(data.suggestions)) return data.suggestions;
        return [data];
      }

      function visibleItems() {
        const q = state.filter.trim().toLowerCase();
        const items = allItems().filter((item) => typeof item === "object" && item);
        if (!q) return items;
        return items.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
      }

      function formatRange(range, unit) {
        if (!range || typeof range !== "object") return "";
        const min = range.min ?? range.minimum;
        const max = range.max ?? range.maximum;
        const suffix = range.unit || unit || "";
        if (min === undefined && max === undefined) return "";
        if (min !== undefined && max !== undefined) return min + "-" + max + (suffix ? " " + suffix : "");
        return String(min ?? max) + (suffix ? " " + suffix : "");
      }

      function rangeFor(item, key, unit) {
        const nested = asObject(item.water_parameters);
        return formatRange(item[key] || nested[key], unit);
      }

      function humanize(value) {
        return String(value || "").replaceAll("_", " ").replace(/\\b\\w/g, (letter) => letter.toUpperCase());
      }

      function chip(label, tone) {
        const className = tone ? "chip " + tone : "chip";
        return '<span class="' + className + '">' + escapeHtml(label) + '</span>';
      }

      function chipsFor(item) {
        const chips = [];
        const tank = item.min_tank_liters || item.minimum_tank_liters || item.tank_liters;
        const temp = rangeFor(item, "temperature_range", "C") || item.temperature;
        const ph = rangeFor(item, "ph_range") || item.ph;
        const gh = rangeFor(item, "gh_range");
        const care = item.care_level || item.difficulty || item.compatibility_level;
        if (tank) chips.push({ label: tank + " L", tone: "water" });
        if (temp) chips.push({ label: "Temp " + temp, tone: "water" });
        if (ph) chips.push({ label: "pH " + ph, tone: "water" });
        if (gh) chips.push({ label: "GH " + gh, tone: "water" });
        if (care) chips.push({ label: humanize(care), tone: "plant" });
        return chips;
      }

      function renderList() {
        const items = visibleItems();
        if (!items.length) {
          list.innerHTML = '<div class="empty">No visible habitat data yet. Run an Atlarium tool or clear the filter.</div>';
          return;
        }

        list.innerHTML = items.map((item, index) => {
          const chips = chipsFor(item).map((entry) => chip(entry.label, entry.tone)).join("");
          return '<button class="item ' + (index === state.selectedIndex ? "active" : "") + '" data-index="' + index + '">' +
            '<span class="item-title"><span>' + escapeHtml(titleFor(item)) + '</span><span class="latin">' + escapeHtml(scientificFor(item)) + '</span></span>' +
            '<span class="chips">' + chips + '</span>' +
            '</button>';
        }).join("");
      }

      function renderDetail() {
        const items = visibleItems();
        const item = asObject(items[state.selectedIndex] || state.data);
        if (!Object.keys(item).length) {
          detail.innerHTML = '<div class="empty">Select a result to inspect habitat details.</div>';
          return;
        }

        if (state.tab === "compatibility") {
          detail.innerHTML = renderCompatibility(item);
          return;
        }
        if (state.tab === "suggestions") {
          detail.innerHTML = renderSuggestion(item);
          return;
        }
        detail.innerHTML = renderProfile(item);
      }

      function renderProfile(item) {
        const summary = item.summary || item.description || item.short_description || item.care_summary || item.notes || "";
        return '<h2>' + escapeHtml(titleFor(item)) + '</h2>' +
          '<p class="summary">' + escapeHtml(scientificFor(item) || item.slug || "Structured Atlarium profile") + '</p>' +
          (summary ? '<p class="body-copy">' + escapeHtml(summary) + '</p>' : "") +
          '<div class="metrics">' +
          metric("Tank", item.min_tank_liters || item.minimum_tank_liters || item.tank_liters, "L") +
          metric("Temperature", rangeFor(item, "temperature_range", "C") || item.temperature) +
          metric("pH", rangeFor(item, "ph_range") || item.ph) +
          metric("GH / KH", [rangeFor(item, "gh_range"), rangeFor(item, "kh_range")].filter(Boolean).join(" / ")) +
          metric("Care", item.care_level || item.difficulty) +
          '</div>' +
          '<div class="actions">' +
          actionButton("get_water_parameters", "Water parameters") +
          actionButton("search_guides", "Care guides") +
          '</div>';
      }

      function renderCompatibility(item) {
        const level = item.compatibility_level || item.level || "compatibility check";
        const summary = item.summary || item.explanation || item.message || "";
        const warnings = Array.isArray(item.warnings) ? item.warnings : [];
        const issues = Array.isArray(item.issues) ? item.issues : [];
        const actions = Array.isArray(item.recommended_actions) ? item.recommended_actions : [];
        const profiles = Array.isArray(item.species_profiles) ? item.species_profiles : [];
        const disclaimer = item.disclaimer || "";
        return '<div class="compat">' +
          '<h2>' + escapeHtml(humanize(level)) + '</h2>' +
          '<p class="summary">' + escapeHtml(summary || "Review overlapping care and water parameter constraints.") + '</p>' +
          renderNoticeList("Watch points", warnings.concat(issues), "warning") +
          renderNoticeList("Recommended actions", actions, "") +
          renderSpeciesProfiles(profiles) +
          (disclaimer ? '<p class="disclaimer">' + escapeHtml(disclaimer) + '</p>' : "") +
          '</div>';
      }

      function renderSuggestion(item) {
        const reason = item.reason || item.rationale || item.summary || "";
        const reasonChips = reasonParts(reason).map((part) => chip(part, "plant")).join("");
        return '<h2>' + escapeHtml(titleFor(item)) + '</h2>' +
          '<p class="summary">' + escapeHtml(scientificFor(item) || item.slug || "Suggested habitat candidate") + '</p>' +
          (reasonChips ? '<div class="chips">' + reasonChips + '</div>' : "") +
          '<div class="metrics">' +
          metric("Tank", item.min_tank_liters || item.minimum_tank_liters || item.tank_liters, "L") +
          metric("Temperature", rangeFor(item, "temperature_range", "C") || item.temperature) +
          metric("pH", rangeFor(item, "ph_range") || item.ph) +
          metric("GH / KH", [rangeFor(item, "gh_range"), rangeFor(item, "kh_range")].filter(Boolean).join(" / ")) +
          metric("Care", item.care_level || item.difficulty || item.temperament) +
          '</div>';
      }

      function reasonParts(reason) {
        return String(reason || "")
          .split(";")
          .map((part) => humanize(part.replace(/:/g, " ")).trim())
          .filter(Boolean)
          .slice(0, 6);
      }

      function renderNoticeList(title, values, className) {
        if (!values.length) return "";
        return '<h3 class="section-title">' + escapeHtml(title) + '</h3>' +
          '<div class="stack">' +
          values.map((value) => '<div class="mini-card ' + className + '">' + escapeHtml(String(value)) + '</div>').join("") +
          '</div>';
      }

      function renderSpeciesProfiles(profiles) {
        if (!profiles.length) return "";
        return '<h3 class="section-title">Species reviewed</h3>' +
          '<div class="stack">' +
          profiles.map((profile) => {
            const item = asObject(profile);
            const chips = chipsFor(item).map((entry) => chip(entry.label, entry.tone)).join("");
            return '<div class="mini-card"><strong>' + escapeHtml(titleFor(item)) + '</strong>' +
              '<span class="summary">' + escapeHtml(scientificFor(item) || item.slug || "") + '</span>' +
              '<span class="chips">' + chips + '</span></div>';
          }).join("") +
          '</div>';
      }

      function metric(label, value, suffix) {
        if (value === undefined || value === null || value === "") return "";
        return '<div class="metric"><strong>' + escapeHtml(label) + '</strong><span>' + escapeHtml(String(value) + (suffix ? " " + suffix : "")) + '</span></div>';
      }

      function actionButton(tool, label) {
        return '<button class="action" data-tool="' + tool + '">' + escapeHtml(label) + '</button>';
      }

      function render() {
        tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.tab === state.tab)));
        status.textContent = state.data ? "Showing " + (state.tool || "Atlarium data") : "Waiting for Atlarium tool data";
        renderList();
        renderDetail();
      }

      function callTool(name) {
        const selected = asObject(visibleItems()[state.selectedIndex] || {});
        const slug = selected.slug || "aequidens-pulcher";
        const argsByTool = {
          get_water_parameters: { type: "fish", slug, language: "en" },
          search_guides: { query: selected.common_name || selected.name || slug, language: "en", limit: 3 },
          suggest_species_for_tank: { tank_liters: 90, language: "en", ph: 6.8, temperature: 24, planted_tank: true, beginner_friendly: true, limit: 5 },
          check_species_compatibility: { species: ["paracheirodon-innesi", "trigonostigma-heteromorpha"], language: "en", tank_liters: 90, ph: 6.8, temperature: 24 }
        };
        const args = argsByTool[name] || {};

        if (openai && typeof openai.callTool === "function") {
          openai.callTool(name, args).then(receivePayload).catch((error) => {
            status.textContent = error && error.message ? error.message : "Tool call failed";
          });
          return;
        }

        window.parent.postMessage({
          jsonrpc: "2.0",
          id: rpcId++,
          method: "tools/call",
          params: { name, arguments: args }
        }, "*");
        status.textContent = "Requested " + name + " from host";
      }

      function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (char) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[char]);
      }

      tabs.forEach((tab) => tab.addEventListener("click", () => {
        state.tab = tab.dataset.tab || "results";
        render();
      }));

      filter.addEventListener("input", () => {
        state.filter = filter.value;
        state.selectedIndex = 0;
        render();
      });

      document.addEventListener("click", (event) => {
        const item = event.target.closest("[data-index]");
        if (item) {
          state.selectedIndex = Number(item.dataset.index || 0);
          render();
          return;
        }
        const action = event.target.closest("[data-tool]");
        if (action) {
          callTool(action.dataset.tool);
        }
      });

      window.addEventListener("message", (event) => {
        const message = event.data;
        if (!message || typeof message !== "object") return;
        if (message.method === "ui/notifications/tool-result") {
          receivePayload(message.params && (message.params.result || message.params));
          return;
        }
        if ("result" in message) {
          receivePayload(message.result);
        }
      });

      if (openai && openai.toolOutput) {
        receivePayload(openai.toolOutput);
      } else {
        receivePayload({
          tool: "search_fish",
          data: {
            results: [
              {
                common_name: "Blue Acara",
                scientific_name: "Andinoacara pulcher",
                slug: "aequidens-pulcher",
                min_tank_liters: 120,
                temperature_range: { min: 22, max: 30, unit: "C" },
                ph_range: { min: 6.5, max: 8 },
                care_level: "moderate",
                summary: "A sturdy cichlid best reviewed with tank size and community temperament in mind."
              }
            ]
          }
        });
      }
    })();
  </script>
</body>
</html>`;
}
