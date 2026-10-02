import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// tsconfig maps "*" to ./src/*, but vite-tsconfig-paths skips those
// imports on Windows because include globs use forward slashes.
function srcStarAlias() {
  const srcRoot = path.resolve(__dirname, "src");
  return {
    name: "src-star-alias",
    enforce: "pre",
    async resolveId(source, importer, options) {
      if (
        !importer ||
        source.startsWith("\0") ||
        source.startsWith(".") ||
        path.isAbsolute(source)
      ) {
        return null;
      }
      return this.resolve(path.join(srcRoot, source), importer, {
        ...options,
        skipSelf: true,
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    srcStarAlias(),
    tsconfigPaths({ projects: ["./tsconfig.app.json"] }),
    react(),
  ],
  base: "/talent/",
  envPrefix: ["TALENT_", "TB_"],
  resolve: {
    alias: {
      shared: path.resolve(__dirname, "src/shared"),
      assets: path.resolve(__dirname, "src/assets"),
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
