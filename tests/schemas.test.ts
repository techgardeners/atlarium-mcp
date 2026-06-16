import { describe, expect, it } from "vitest";

import {
  compatibilitySchema,
  getPathProfileSchema,
  getProfileSchema,
  searchFishSchema,
  suggestionsSchema,
  waterParametersSchema,
} from "../src/schemas.js";

describe("tool input schemas", () => {
  it("rejects unknown fields", () => {
    expect(
      searchFishSchema.safeParse({
        extra: true,
        query: "neon",
      }).success,
    ).toBe(false);
  });

  it("enforces bounded search and range inputs", () => {
    expect(searchFishSchema.safeParse({ query: "n".repeat(121) }).success).toBe(false);
    expect(searchFishSchema.safeParse({ ph_min: -1 }).success).toBe(false);
    expect(searchFishSchema.safeParse({ ph_max: 15 }).success).toBe(false);
    expect(searchFishSchema.safeParse({ gh_min: -1 }).success).toBe(false);
    expect(searchFishSchema.safeParse({ temperature_max: 60 }).success).toBe(false);
    expect(searchFishSchema.safeParse({ offset: 10_001 }).success).toBe(false);
  });

  it("uses single-segment slugs for direct species and water parameter lookups", () => {
    expect(getProfileSchema.safeParse({ slug: "neon-tetra" }).success).toBe(true);
    expect(getProfileSchema.safeParse({ slug: "fish/neon-tetra" }).success).toBe(false);
    expect(waterParametersSchema.safeParse({ slug: "../secret", type: "fish" }).success).toBe(
      false,
    );
  });

  it("allows safe slug paths only for path profile tools", () => {
    expect(
      getPathProfileSchema.safeParse({
        slug: "equipment/filters/eheim/classic-150",
      }).success,
    ).toBe(true);
    expect(getPathProfileSchema.safeParse({ slug: "equipment//filters" }).success).toBe(false);
    expect(getPathProfileSchema.safeParse({ slug: "../filters" }).success).toBe(false);
  });

  it("bounds compatibility and suggestion water parameter inputs", () => {
    expect(compatibilitySchema.safeParse({ species: ["neon tetra"], ph: 7 }).success).toBe(true);
    expect(compatibilitySchema.safeParse({ species: [], ph: 7 }).success).toBe(false);
    expect(compatibilitySchema.safeParse({ species: ["x"], kh: -1 }).success).toBe(false);
    expect(suggestionsSchema.safeParse({ tank_liters: 60, temperature: 25 }).success).toBe(true);
    expect(suggestionsSchema.safeParse({ tank_liters: 0 }).success).toBe(false);
    expect(suggestionsSchema.safeParse({ tank_liters: 60, temperature: 50 }).success).toBe(false);
  });
});
