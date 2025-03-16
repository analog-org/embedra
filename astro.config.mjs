// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    sentry(),
    spotlightjs(),
    react({
      include: ["**/react/*"],
    }),
  ],
  output: "server", // Enable SSR mode
  vite: {
    plugins: [tailwindcss()],
  },
});
