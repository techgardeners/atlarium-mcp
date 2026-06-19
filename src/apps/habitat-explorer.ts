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
      widgetDescription:
        "Render Atlarium habitat data as searchable cards, profile panels and compatibility summaries.",
    },
    "openai/widgetDescription":
      "Render Atlarium habitat data as searchable cards, profile panels and compatibility summaries.",
    "openai/widgetPrefersBorder": false,
    "openai/widgetCSP": {
      connect_domains: [],
      resource_domains: [],
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
      --bg: #f6f8f7;
      --panel: #ffffff;
      --ink: #16201c;
      --muted: #66736d;
      --line: #dce5e0;
      --accent: #087f72;
      --accent-ink: #ffffff;
      --warn: #a15c00;
      --soft: #e8f3f0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #111715;
        --panel: #18211e;
        --ink: #edf5f1;
        --muted: #a5b3ad;
        --line: #2b3934;
        --accent: #4fc3b4;
        --accent-ink: #071412;
        --warn: #f1b35b;
        --soft: #20322d;
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

    .shell {
      min-height: 100vh;
      padding: 18px;
      display: grid;
      grid-template-rows: auto auto 1fr;
      gap: 14px;
    }

    .topbar {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
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
      margin-top: 4px;
    }

    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tab, .action {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--panel);
      color: var(--ink);
      cursor: pointer;
      min-height: 34px;
      padding: 7px 12px;
      transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
    }

    .tab:hover, .action:hover {
      transform: translateY(-1px);
      border-color: var(--accent);
    }

    .tab[aria-selected="true"], .action.primary {
      background: var(--accent);
      border-color: var(--accent);
      color: var(--accent-ink);
    }

    .workspace {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
      gap: 14px;
      min-height: 0;
    }

    .pane {
      min-width: 0;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
    }

    .filter {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: transparent;
      color: var(--ink);
      min-height: 38px;
      padding: 8px 10px;
      margin-bottom: 12px;
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
      background: transparent;
      color: var(--ink);
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;
      transition: border-color 160ms ease, background 160ms ease;
    }

    .item:hover, .item.active {
      border-color: var(--accent);
      background: var(--soft);
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
      color: var(--muted);
      font-size: 11px;
      padding: 3px 7px;
    }

    .detail {
      min-height: 220px;
    }

    .detail h2 {
      font-size: 17px;
      margin: 0 0 4px;
      letter-spacing: 0;
    }

    .summary {
      color: var(--muted);
      margin: 0 0 12px;
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin: 12px 0;
    }

    .metric {
      border-top: 1px solid var(--line);
      padding-top: 8px;
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

    .empty {
      color: var(--muted);
      border: 1px dashed var(--line);
      border-radius: 8px;
      padding: 18px;
    }

    .compat {
      border-left: 3px solid var(--accent);
      padding-left: 10px;
    }

    .warning {
      color: var(--warn);
    }

    @media (max-width: 720px) {
      .shell { padding: 12px; }
      .topbar { display: grid; }
      .workspace { grid-template-columns: 1fr; }
      .list { max-height: 42vh; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <header class="topbar">
      <div>
        <h1>Atlarium Habitat Explorer</h1>
        <div class="status" id="status">Waiting for Atlarium tool data</div>
      </div>
      <nav class="tabs" aria-label="Habitat views">
        <button class="tab" data-tab="results" aria-selected="true">Results</button>
        <button class="tab" data-tab="profile" aria-selected="false">Profile</button>
        <button class="tab" data-tab="compatibility" aria-selected="false">Compatibility</button>
        <button class="tab" data-tab="suggestions" aria-selected="false">Suggestions</button>
      </nav>
    </header>

    <section class="pane">
      <input id="filter" class="filter" type="search" placeholder="Filter visible habitat data" />
      <div class="actions">
        <button class="action primary" data-tool="suggest_species_for_tank">Suggest for 90 L planted tank</button>
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
        return item.common_name || item.name || item.title || item.slug || item.scientific_name || "Habitat item";
      }

      function scientificFor(item) {
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

      function chipsFor(item) {
        const chips = [];
        const tank = item.min_tank_liters || item.minimum_tank_liters || item.tank_liters;
        const temp = formatRange(item.temperature_range, "C") || item.temperature;
        const ph = formatRange(item.ph_range) || item.ph;
        const care = item.care_level || item.difficulty || item.compatibility_level;
        if (tank) chips.push(tank + " L");
        if (temp) chips.push("Temp " + temp);
        if (ph) chips.push("pH " + ph);
        if (care) chips.push(String(care).replaceAll("_", " "));
        return chips;
      }

      function renderList() {
        const items = visibleItems();
        if (!items.length) {
          list.innerHTML = '<div class="empty">No visible habitat data yet. Run an Atlarium tool or clear the filter.</div>';
          return;
        }

        list.innerHTML = items.map((item, index) => {
          const chips = chipsFor(item).map((chip) => '<span class="chip">' + escapeHtml(chip) + '</span>').join("");
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
        const summary = item.summary || item.description || item.care_summary || item.notes || "";
        return '<h2>' + escapeHtml(titleFor(item)) + '</h2>' +
          '<p class="summary">' + escapeHtml(scientificFor(item) || item.slug || "Structured Atlarium profile") + '</p>' +
          (summary ? '<p>' + escapeHtml(summary) + '</p>' : "") +
          '<div class="metrics">' +
          metric("Tank", item.min_tank_liters || item.minimum_tank_liters || item.tank_liters, "L") +
          metric("Temperature", formatRange(item.temperature_range, "C") || item.temperature) +
          metric("pH", formatRange(item.ph_range) || item.ph) +
          metric("Care", item.care_level || item.difficulty || item.temperament) +
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
        return '<div class="compat">' +
          '<h2>' + escapeHtml(String(level).replaceAll("_", " ")) + '</h2>' +
          '<p class="summary">' + escapeHtml(summary || "Review overlapping care and water parameter constraints.") + '</p>' +
          warnings.map((warning) => '<p class="warning">' + escapeHtml(String(warning)) + '</p>').join("") +
          '</div>';
      }

      function renderSuggestion(item) {
        const reason = item.reason || item.rationale || item.summary || "";
        return '<h2>' + escapeHtml(titleFor(item)) + '</h2>' +
          '<p class="summary">' + escapeHtml(scientificFor(item) || item.slug || "Suggested habitat candidate") + '</p>' +
          (reason ? '<p>' + escapeHtml(reason) + '</p>' : "") +
          '<div class="metrics">' +
          metric("Tank", item.min_tank_liters || item.minimum_tank_liters || item.tank_liters, "L") +
          metric("Temperature", formatRange(item.temperature_range, "C") || item.temperature) +
          metric("pH", formatRange(item.ph_range) || item.ph) +
          metric("Care", item.care_level || item.difficulty || item.temperament) +
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
