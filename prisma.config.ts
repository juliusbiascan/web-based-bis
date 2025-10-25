import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig, env } from "prisma/config";

const envPath = resolve(process.cwd(), ".env");

if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (!key || key in process.env) {
      continue;
    }

    const value = line.slice(separatorIndex + 1).trim();
    process.env[key] = value.replace(/^['"]|['"]$/g, "");
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
