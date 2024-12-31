import type { Config } from "drizzle-kit";
import path from "path";
import globalConfig from "../../global-config.json";

const nodeEnv = (process.env.NODE_ENV ?? "development") as "test" | "development";

export const databaseFile = path.resolve(__dirname, globalConfig[nodeEnv].server.dbFileName);

export default {
  out: "./db/migrations",
  schema: "./db/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: databaseFile,
  },
} satisfies Config;
