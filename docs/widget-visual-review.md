# Habitat Explorer v4 — visual review gate

Status: **visually approved; localization patch 2.0.3 qualified on 2026-08-16**.

This gallery completed the visual approval gate. Production and the Official
Registry remain on `2.0.2` while the qualified `2.0.3` candidate closes the
Italian and Spanish localization gaps found during real ChatGPT host testing.
ChatGPT App resubmission remains a separate external review gate.

## Final visual rules

- Fish and plant search cards and profiles use real Atlarium catalog media.
- Explicit trusted media always wins; missing or failed result media stays
  empty and never falls back to a mascot.
- Mascots are the existing transparent Atlarium cutouts, optimized to 192 px.
  They appear on the left only as compact editorial accents in loading, empty
  and error states. Habitat planning, fertilization and every view with real
  result data contain none.
- Inline profiles show at most two editorial chapters with three-line body
  previews. Fullscreen profiles show every chapter with a distinct cyan,
  uppercase chapter heading.
- Inline result cards contain at most two actions and never use nested vertical
  scrolling.
- Metric labels and known units are localized for English, Italian and Spanish.
- Product and diagnostic profiles without media use a focused single-column
  composition instead of reserving an empty image panel.

## Desktop and fullscreen

| Family | Mode | Theme / locale | Evidence |
|---|---|---|---|
| Search | inline desktop | light / EN | [search desktop](assets/chatgpt-screenshots/v4-search-desktop-light-en.png) |
| Fish profile | inline desktop | dark / IT | [fish profile inline](assets/chatgpt-screenshots/v4-fish-profile-inline-dark-it.png) |
| Fish profile | fullscreen | light / IT | [fish profile fullscreen](assets/chatgpt-screenshots/v4-fish-profile-fullscreen-light-it.png) |
| Product search | inline desktop, no invented media | light / EN | [product search](assets/chatgpt-screenshots/v4-products-search-inline-light-en.png) |
| Product categories | inline tablet 768×1024 | light / EN | [product categories](assets/chatgpt-screenshots/v4-categories-tablet-light-en.png) |
| Product brands | inline desktop | dark / EN | [product brands](assets/chatgpt-screenshots/v4-brands-inline-dark-en.png) |
| Product profile | inline desktop, no media | dark / EN | [product profile](assets/chatgpt-screenshots/v4-product-profile-inline-dark-en.png) |
| Equipment profile | inline desktop, real product media | light / EN | [equipment profile](assets/chatgpt-screenshots/v4-equipment-profile-inline-light-en.png) |
| Fertilizer profile | fullscreen, real product media | dark / EN | [fertilizer profile](assets/chatgpt-screenshots/v4-fertilizer-profile-fullscreen-dark-en.png) |
| Compatibility | inline desktop | light / EN | [compatibility inline](assets/chatgpt-screenshots/v4-compatibility-inline-light-en.png) |
| Compatibility | fullscreen | dark / EN | [compatibility fullscreen](assets/chatgpt-screenshots/v4-compatibility-fullscreen-dark-en.png) |
| Compatibility | inline desktop | dark / IT | [compatibility localized](assets/chatgpt-screenshots/v4-compatibility-inline-dark-it.png) |
| Habitat plan | inline desktop | light / IT | [habitat inline](assets/chatgpt-screenshots/v4-habitat-inline-light-it.png) |
| Habitat plan | fullscreen | dark / IT | [habitat fullscreen](assets/chatgpt-screenshots/v4-habitat-fullscreen-dark-it.png) |
| Diagnostic | inline desktop, no media | light / IT | [diagnostic inline](assets/chatgpt-screenshots/v4-diagnostic-inline-light-it.png) |
| Diagnostic | fullscreen, no media | dark / IT | [diagnostic fullscreen](assets/chatgpt-screenshots/v4-diagnostic-fullscreen-dark-it.png) |
| Disease profile | fullscreen 1440×900, real media | dark / EN | [disease profile](assets/chatgpt-screenshots/v4-disease-profile-fullscreen-dark-en.png) |
| Fertilization plan | inline desktop | dark / IT | [fertilization plan](assets/chatgpt-screenshots/v4-fertilization-plan-inline-dark-it.png) |
| Nutrient gaps | fullscreen | dark / EN | [nutrient gaps](assets/chatgpt-screenshots/v4-nutrient-gaps-fullscreen-dark-en.png) |
| Weekly dose totals | inline desktop | light / EN | [weekly totals](assets/chatgpt-screenshots/v4-weekly-dose-totals-inline-light-en.png) |
| Tank weight | inline desktop | dark / IT | [tank weight](assets/chatgpt-screenshots/v4-tank-weight-inline-dark-it.png) |
| Water chemistry | fullscreen | light / EN | [water chemistry](assets/chatgpt-screenshots/v4-water-chemistry-fullscreen-light-en.png) |
| Unit conversion | inline desktop | light / IT | [unit conversion](assets/chatgpt-screenshots/v4-unit-conversion-inline-light-it.png) |
| Equipment requirements | fullscreen | dark / ES | [equipment requirements](assets/chatgpt-screenshots/v4-equipment-requirements-fullscreen-dark-es.png) |
| Incomplete calculator | inline desktop | light / IT | [incomplete calculator](assets/chatgpt-screenshots/v4-calculator-incomplete-inline-light-it.png) |
| Empty state | inline desktop | light / EN | [empty](assets/chatgpt-screenshots/v4-empty-inline-light-en.png) |
| Error state | inline desktop | dark / IT | [error](assets/chatgpt-screenshots/v4-error-inline-dark-it.png) |

## Mobile

| Family | Mode | Theme / locale | Evidence |
|---|---|---|---|
| Search carousel | inline 390×844 | dark / IT | [search mobile](assets/chatgpt-screenshots/v4-search-mobile-dark-it.png) |
| Plant profile | inline 390×844 | light / ES | [plant profile mobile](assets/chatgpt-screenshots/v4-plant-profile-mobile-light-es.png) |
| Equipment search | inline 390×844 | dark / EN | [equipment search mobile](assets/chatgpt-screenshots/v4-equipment-search-mobile-dark-en.png) |
| Suggestions | inline 390×844 | dark / EN | [suggestions mobile](assets/chatgpt-screenshots/v4-suggestions-mobile-dark-en.png) |
| Calculator | inline 360×800 | light / EN | [calculator mobile](assets/chatgpt-screenshots/v4-calculator-mobile-light-en.png) |
| Fertilizer dose | inline 390×844 | light / ES | [fertilizer dose mobile](assets/chatgpt-screenshots/v4-fertilizer-dose-mobile-light-es.png) |
| Water change | inline 390×844 | dark / ES | [water change mobile](assets/chatgpt-screenshots/v4-water-change-mobile-dark-es.png) |
| Loading state | inline 390×844 | dark / ES | [loading mobile](assets/chatgpt-screenshots/v4-loading-mobile-dark-es.png) |

## Composite review sheets

- [Desktop and fullscreen contact sheet](assets/chatgpt-screenshots/v4-review-desktop-contact-sheet.png)
- [Mobile contact sheet](assets/chatgpt-screenshots/v4-review-mobile-contact-sheet.png)

## Real ChatGPT host evidence

These captures are separate from deterministic widget fixtures:

- [direct fish search in ChatGPT web](assets/chatgpt-screenshots/real-host/search-fish-web.jpg)
- [direct fish profile in ChatGPT web](assets/chatgpt-screenshots/real-host/fish-profile-web.jpg)
- [fish profile at 390x844 responsive viewport](assets/chatgpt-screenshots/real-host/fish-profile-mobile-390x844.jpg)

The 390x844 image proves responsive host rendering, not native iOS/Android
execution. Native mobile recording remains required before final submission.

## Automated visual gate

`pnpm widget:screenshots` builds the single-file v4 artifact and captures all
35 production-shaped cases. It fails when any case has:

- missing expected content;
- a mascot accent in a non-editorial result or a missing expected accent;
- missing real catalog media or brand logos in a fixture that supplies them;
- invented product media when the production payload supplies none;
- unlocalized backend disclaimer copy;
- an image without an alt attribute or an exposed decorative mascot image;
- more than two buttons in a result card;
- horizontal page overflow; or
- nested vertical scrolling;
- no keyboard-reachable visible focus state;
- text contrast below WCAG AA; or
- a reported inline height larger than the widget's intrinsic content height.
