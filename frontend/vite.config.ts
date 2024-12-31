import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import globalConfig from "../global-config.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true,
    port: globalConfig[process.env.NODE_ENV ?? "development"].frontend.port,
  },
});
