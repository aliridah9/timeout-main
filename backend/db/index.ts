import Database from "better-sqlite3";
import { databaseFile } from "./drizzle.config";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";

const sqlite = new Database(databaseFile);

export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: path.resolve(__dirname, "./migrations") });
