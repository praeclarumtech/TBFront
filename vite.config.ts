import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vite.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  envPrefix: "TB",
  server: {
    host: true,
    open: true,
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});
