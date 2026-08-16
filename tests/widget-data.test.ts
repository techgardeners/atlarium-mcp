import { describe, expect, it } from "vitest";

import { imageFor } from "../src/apps/habitat-explorer-ui/src/data.js";

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
  });

  it("prefers an explicit trusted image and does not invent media for unrelated records", () => {
    expect(
      imageFor({
        image_url: "https://atlarium.bio/media/catalog/custom.webp",
        slug: "paracheirodon-innesi",
        public_url: "https://atlarium.bio/it/catalog/fish/paracheirodon-innesi",
      }),
    ).toBe("https://atlarium.bio/media/catalog/custom.webp");

    expect(
      imageFor({
        slug: "external-record",
        public_url: "https://example.com/catalog/fish/external-record",
      }),
    ).toBe("");
  });
});
