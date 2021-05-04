import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";

let cfg: Config;

export interface Config {
  appkitEnv: string;
  configPath: string;
  entryRoot: string;
  host: string;
  loggerRedactPaths: string[];
  nodeEnv: string;
  port: number;
  routesPath: string;
}

export function getConfig(): Config {
  if (cfg) return cfg;

  if (!process.env.APPKIT_ENV) {
    process.env.APPKIT_ENV = "development";
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }

  const configPath = resolve(process.cwd(), `configs/${process.env.APPKIT_ENV}.env`);

  const tsconfig = JSON.parse(readFileSync(`${process.cwd()}/tsconfig.json`, "utf-8"));
  const entryRoot = process.env.NODE_ENV === "development" ? "src" : tsconfig?.outDir || "dist";

  config({
    path: configPath,
  });

  cfg = {
    appkitEnv: process.env.APPKIT_ENV || "development",
    configPath: configPath.replace(`${process.cwd()}/`, ""),
    entryRoot,
    host: process.env.APPKIT_HOST || "0.0.0.0",
    loggerRedactPaths: process.env.APPKIT_LOGGER_REDACT_PATHS ? process.env.APPKIT_LOGGER_REDACT_PATHS.split(",") : [],
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.APPKIT_PORT || "") || 3000,
    routesPath: `${entryRoot}/${process.env.APPKIT_ROUTES_PATH || "routes"}`,
  };

  return cfg;
}
