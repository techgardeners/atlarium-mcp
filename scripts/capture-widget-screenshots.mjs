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
  profile: {
    tool: "get_fish_profile",
    language: "it",
    data: {
      common_name: "Tetra neon",
      scientific_name: "Paracheirodon innesi",
      slug: "paracheirodon-innesi",
      summary: "Piccolo caracide di branco adatto ad acquari maturi, piantumati e con parametri stabili.",
      min_tank_liters: 60,
      temperature_range: { min: 20, max: 26, unit: "°C" },
      ph_range: { min: 4.5, max: 7.5 },
      gh_range: { min: 1, max: 8 },
      care_level: "Facile",
      public_url: "https://atlarium.bio/it/catalog/fish/paracheirodon-innesi",
    },
  },
  compatibility: {
    tool: "check_species_compatibility",
    data: {
      compatibility_level: "Compatible with caution",
      summary: "The pair can share a planted community tank when temperature and flow remain moderate.",
      warnings: ["Avoid strong flow around Betta splendens.", "Observe feeding competition during the first weeks."],
      recommended_actions: ["Keep the tank at 24–25 °C.", "Provide quiet planted zones and visual breaks."],
      disclaimer: "Compatibility is advisory and individual behavior can vary.",
      species_profiles: [
        { common_name: "Betta splendens", scientific_name: "Betta splendens", slug: "betta-splendens", min_tank_liters: 40, temperature_range: { min: 24, max: 28, unit: "°C" } },
        { common_name: "Peppered corydoras", scientific_name: "Corydoras paleatus", slug: "corydoras-paleatus", min_tank_liters: 80, temperature_range: { min: 20, max: 25, unit: "°C" } },
      ],
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
      title: "Rectangular aquarium volume",
      gross_volume_liters: 64.8,
      estimated_net_volume_liters: 55.1,
      length_cm: 60,
      width_cm: 30,
      height_cm: 36,
      displacement_percent: 15,
      disclaimer: "The net value is an estimate; substrate, hardscape and fill height change the real volume.",
    },
  },
  habitat: {
    tool: "suggest_habitat_for_tank",
    data: {
      title: "Quiet planted freshwater community",
      summary: "A layered 120 L habitat with a calm midwater school, a social bottom group and resilient epiphytes.",
      species: [
        { common_name: "Harlequin rasbora", reason: "Primary midwater school" },
        { common_name: "Peppered corydoras", reason: "Bottom group for a soft, open foreground" },
      ],
      plants: [{ name: "Java fern" }, { name: "Anubias barteri" }, { name: "Cryptocoryne wendtii" }],
      equipment: [{ name: "Adjustable 100 W heater" }, { name: "Gentle external filter" }],
      guides: [{ title: "Cycling a planted aquarium" }, { title: "Managing nitrate" }],
      warnings: ["Complete the nitrogen cycle before adding livestock.", "Introduce groups gradually and monitor feeding."],
    },
  },
};

const cases = [
  { name: "v4-results-light", fixture: fixtures.results, theme: "light", viewport: { width: 900, height: 720 } },
  { name: "v4-profile-dark-it", fixture: fixtures.profile, theme: "dark", locale: "it-IT", viewport: { width: 900, height: 720 } },
  { name: "v4-compatibility-light", fixture: fixtures.compatibility, theme: "light", viewport: { width: 900, height: 760 } },
  { name: "v4-suggestions-mobile-dark", fixture: fixtures.suggestions, theme: "dark", viewport: { width: 390, height: 844 } },
  { name: "v4-calculator-mobile-light", fixture: fixtures.calculator, theme: "light", viewport: { width: 360, height: 800 } },
  { name: "v4-habitat-fullscreen-dark", fixture: fixtures.habitat, theme: "dark", displayMode: "fullscreen", viewport: { width: 1280, height: 800 } },
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
          setWidgetState(nextState) { host.widgetState = nextState; },
          async callTool() { return undefined; },
          async sendFollowUpMessage() {},
          async requestDisplayMode({ mode }) {
            host.displayMode = mode;
            window.dispatchEvent(new CustomEvent("openai:set_globals", { detail: { globals: { displayMode: mode } } }));
          },
          notifyIntrinsicHeight() {},
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

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) throw new Error(`${item.name} has horizontal page overflow.`);
    const nestedVerticalScroll = await page.evaluate(() =>
      [...document.querySelectorAll("main *")].some((element) => {
        const style = getComputedStyle(element);
        return ["auto", "scroll"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
      }),
    );
    if (nestedVerticalScroll) throw new Error(`${item.name} has nested vertical scrolling.`);

    await page.screenshot({
      path: resolve(outputDirectory, `${item.name}.png`),
      fullPage: true,
    });
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

console.log(JSON.stringify({ screenshots: cases.map((item) => `docs/assets/chatgpt-screenshots/${item.name}.png`) }));
