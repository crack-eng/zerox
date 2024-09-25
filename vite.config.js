import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "#apps": path.resolve(import.meta.dirname, "apps"),
      "#packages": path.resolve(import.meta.dirname, "packages"),
    },
  },
});
