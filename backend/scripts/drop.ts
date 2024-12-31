import { databaseFile } from "../db/drizzle.config";
import { existsSync, unlinkSync } from "fs";

if (existsSync(databaseFile)) {
  unlinkSync(databaseFile);
  console.log(`db ${databaseFile} dropped`);
} else {
  console.log(`db ${databaseFile} not found. Nothing to drop.`);
}
