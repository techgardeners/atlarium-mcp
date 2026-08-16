import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = resolve(import.meta.dirname);

export default defineConfig({
  root,
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile({ removeViteModuleLoader: true }),
  ],
  build: {
    outDir: resolve(root, "../../../dist/widget"),
    emptyOutDir: true,
    target: "es2022",
    cssMinify: "lightningcss",
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
  },
});
