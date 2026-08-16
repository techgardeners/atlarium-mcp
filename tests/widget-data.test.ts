import { describe, expect, it } from "vitest";

import {
  brandLogoFor,
  extractPayload,
  imageFor,
  itemsFrom,
  productMetrics,
  stringList,
  textSections,
  viewKind,
} from "../src/apps/habitat-explorer-ui/src/data.js";

describe("Habitat Explorer production payload normalization", () => {
  it("preserves MCP error state for plain-text, nested and JSON-RPC error results", () => {
    expect(
      extractPayload({
        isError: true,
        content: [{ type: "text", text: "not_found: Resource not found." }],
      }),
    ).toMatchObject({ tool: "unknown", isError: true });

    expect(
      extractPayload({
        isError: true,
        tool: "get_fish_profile",
        content: [{
          type: "text",
          text: JSON.stringify({ tool: "get_fish_profile", data: { message: "Not found" } }),
        }],
      }),
    ).toEqual({
      tool: "get_fish_profile",
      data: { message: "Not found" },
      language: undefined,
      isError: true,
    });

    expect(
      extractPayload({ error: { code: -32_603, message: "Internal error" } }),
    ).toMatchObject({ tool: "unknown", isError: true });

    expect(
      extractPayload({ structuredContent: { tool: "search_fish", data: { results: [] } } }),
    ).toEqual({
      tool: "search_fish",
      data: { results: [] },
      language: undefined,
    });
  });

  it("extracts production category and brand collections", () => {
    expect(itemsFrom({ categories: [{ slug: "filter", name: "Filtri" }] })).toEqual([
      { slug: "filter", name: "Filtri" },
    ]);
    expect(itemsFrom({ brands: [{ slug: "amtra", name: "Amtra" }] })).toEqual([
      { slug: "amtra", name: "Amtra" },
    ]);
  });

  it("turns production diagnostic Markdown strings into readable list items", () => {
    expect(
      stringList(
        "### Manifestazioni Cliniche - **Segni primari**: letargia e anoressia. - **Stadi avanzati**: lesioni profonde. ### Prevenzione 1. **Quarantena**: isolare i nuovi arrivi. 2. Controllare i [parametri](https://atlarium.bio/it/guide/water-parameters/ph).",
      ),
    ).toEqual([
      "Manifestazioni Cliniche",
      "Segni primari: letargia e anoressia.",
      "Stadi avanzati: lesioni profonde.",
      "Prevenzione",
      "Quarantena: isolare i nuovi arrivi.",
      "Controllare i parametri.",
    ]);

    expect(stringList(["- **Primo** controllo", "Secondo controllo"])).toEqual([
      "Primo controllo",
      "Secondo controllo",
    ]);
  });
});

describe("Habitat Explorer media", () => {
  it("uses the canonical catalog species image when the public payload has no media field", () => {
    expect(
      imageFor({
        slug: "paracheirodon-innesi",
        public_url: "https://atlarium.bio/it/catalog/fish/paracheirodon-innesi",
      }),
    ).toBe(
      "https://atlarium.bio/api/img/img-wm-v11/card-w828-q78.webp?src=%2Fmedia%2Fcatalog%2Fspecies%2Ffish%2Fparacheirodon-innesi%2F01-ai.png&v=img-wm-v11&w=828&q=78&f=webp&p=card",
    );

    expect(
      imageFor({
        slug: "aciotis-acuminifolia",
        public_url: "https://atlarium.bio/es/catalog/plants/aciotis-acuminifolia",
      }),
    ).toContain("%2Fmedia%2Fcatalog%2Fspecies%2Fplant%2Faciotis-acuminifolia%2F01-ai.png");

    expect(
      imageFor({
        slug: "caridina-multidentata",
        public_url: "https://atlarium.bio/it/catalog/invertebrates/caridina-multidentata",
      }),
    ).toContain(
      "%2Fmedia%2Fcatalog%2Fspecies%2Finvertebrate%2Fcaridina-multidentata%2F01-ai.png",
    );

    expect(
      imageFor({
        slug: "a-different-invertebrate",
        public_url: "https://atlarium.bio/it/catalog/invertebrates/caridina-multidentata",
      }),
    ).toBe("");
  });

  it("prefers an explicit trusted image and does not invent media for unrelated records", () => {
    expect(
      imageFor({
        image_url: "https://atlarium.bio/media/catalog/custom.webp",
        slug: "paracheirodon-innesi",
        public_url: "https://atlarium.bio/it/catalog/fish/paracheirodon-innesi",
      }),
    ).toBe(
      "https://atlarium.bio/api/img/img-wm-v11/card-w828-q78.webp?src=%2Fmedia%2Fcatalog%2Fcustom.webp&v=img-wm-v11&w=828&q=78&f=webp&p=card",
    );

    expect(
      imageFor({
        slug: "external-record",
        public_url: "https://example.com/catalog/fish/external-record",
      }),
    ).toBe("");

    expect(imageFor({ common_name: "Neon tetra" })).toBe("");
  });

  it("uses exact product media and derives only deterministic brand logos", () => {
    const product = {
      slug: "equipment/filter/amtra/filpo-click-200",
      brand: "Amtra",
      public_url:
        "https://atlarium.bio/en/guide/products/equipment/filter/amtra/filpo-click-200",
    };

    expect(imageFor(product)).toBe("");
    expect(brandLogoFor(product)).toBe(
      "https://atlarium.bio/api/img/img-wm-v11/micro-w160-q65.webp?src=%2Fimages%2Fmanufacturers%2Famtra.png&v=img-wm-v11&w=160&q=65&f=webp&p=micro",
    );
    expect(
      imageFor({
        ...product,
        image_url: "/media/catalog/equipment/amtra/filpo-click-200/01.jpg",
      }),
    ).toContain("src=%2Fmedia%2Fcatalog%2Fequipment%2Famtra%2Ffilpo-click-200%2F01.jpg");
    expect(
      brandLogoFor({
        brand: "Amtra",
        public_url:
          "https://atlarium.bio/en/guide/products/equipment/filter/amtra/filpo-click-200",
      }),
    ).toContain("src=%2Fimages%2Fmanufacturers%2Famtra.png");
    expect(
      imageFor({
        ...product,
        public_url:
          "https://atlarium.bio/en/guide/products/equipment/filter/amtra/a-different-product",
      }),
    ).toBe("");
  });

  it("presents nested product specifications and routes product profiles separately", () => {
    expect(
      productMetrics({
        category_slug: "filter",
        use_cases: ["FILTER", "INTERNAL"],
        specs: { subType: "INTERNAL", flowRateLitersHour: 200 },
      }),
    ).toEqual([
      { label: "Category", value: "Filter" },
      { label: "Use case", value: "FILTER · INTERNAL" },
      { label: "Sub Type", value: "INTERNAL" },
      { label: "Flow Rate Liters Hour", value: "200 L/h" },
    ]);
    expect(viewKind("get_product_profile")).toBe("product");
    expect(viewKind("get_equipment_profile")).toBe("product");
    expect(viewKind("get_fertilizer_profile")).toBe("product");
    expect(viewKind("search_fertilizers")).toBe("collection");
    expect(viewKind("search_fertilization_regimes")).toBe("collection");
    expect(viewKind("get_fertilization_regime")).toBe("profile");
    expect(viewKind("calculate_fertilizer_dose")).toBe("fertilization");
    expect(viewKind("get_algae_profile")).toBe("diagnostic");
    expect(viewKind("get_disease_profile")).toBe("diagnostic");
    expect(viewKind("get_plant_problem_profile")).toBe("diagnostic");
    expect(viewKind("get_medicine_profile")).toBe("diagnostic");
  });

  it("turns editorial chapter labels into readable sections", () => {
    expect(
      textSections(
        "Origine Geografica e Biotopo: Acque ombreggiate. Tassonomia e Morfologia: Corpo minuto con *banda blu*. Comportamento Sociale: Vive in branco.",
      ),
    ).toEqual([
      { title: "Origine Geografica e Biotopo", body: "Acque ombreggiate." },
      { title: "Tassonomia e Morfologia", body: "Corpo minuto con banda blu." },
      { title: "Comportamento Sociale", body: "Vive in branco." },
    ]);

    expect(textSections("Una descrizione breve senza capitoli.")).toEqual([
      { body: "Una descrizione breve senza capitoli." },
    ]);
  });
});
