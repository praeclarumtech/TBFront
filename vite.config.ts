import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  base: "/talent/",
  envPrefix: ['TALENT_'],
  resolve: {
    alias: {
      shared: path.resolve(__dirname, 'src/shared'),
      assets: path.resolve(__dirname, 'src/assets'),
    },
  },
  server: {
    host: true,
    open: true,
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});
