import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";
import istanbul from "vite-plugin-istanbul";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tsconfigPath = resolve(__dirname, "tsconfig.app.json");
console.log("CY_COVERAGE:", process.env.CYPRESS_COVERAGE);

/* configuration serveur vite utiliser pour coverage e2e */
export default defineConfig({
  root: "./src",
  plugins: [
    angular({
      tsconfig: tsconfigPath,
    }),
    istanbul({
      extension: [".ts", ".js"],
      cypress: true,
      requireEnv: true,
      include: "src/**/*",
      exclude: ["node_modules", "cypress/**/*"],
    }),
  ],
  build: { sourcemap: true },
  server: {
    port: 4200,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
