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

    .brand-mark {
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
      border-radius: 12px;
      box-shadow: 0 10px 24px var(--shadow);
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
      padding: 7px 11px;
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
    }

    .latin {
      color: var(--muted);
      font-style: italic;
      font-size: 12px;
      text-align: right;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .chip {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgb(255 255 255 / 0.38);
      color: var(--muted);
      font-size: 11px;
      padding: 3px 7px;
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
  </style>
</head>
<body>
  <main class="shell">
    <header class="topbar">
      <div class="brand-lockup">
        <svg class="brand-mark" data-brand-mark viewBox="0 0 96 96" role="img" aria-label="Atlarium mark">
          <rect width="96" height="96" rx="22" fill="#061A2D"></rect>
          <path d="M18 59c8-17 27-24 43-17 10 4 17 13 19 24-15 11-34 14-50 6-5-3-9-7-12-13Z" fill="#0EA5E9"></path>
          <path d="M20 59c11 8 26 9 40 3 7-3 14-4 20-2-12 17-39 24-60 8Z" fill="#2DD4BF"></path>
          <path d="M31 38c4-13 15-22 30-26 1 13-5 24-17 31" fill="#3FAF49"></path>
          <path d="M42 40c3-12 13-21 27-25 0 13-7 24-20 31" fill="#75C84A"></path>
          <path d="M23 30c10 0 18 5 23 14-11 1-20-3-27-12Z" fill="#2F8F3A"></path>
          <path d="M21 64c18 17 47 14 62-5" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"></path>
          <circle cx="64" cy="55" r="5" fill="#BDF6FF"></circle>
        </svg>
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
