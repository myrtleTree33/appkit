import { config } from "dotenv";
import { resolve } from "path";

export interface Config {
  appkitEnv: string;
  configPath: string;
  host: string;
  loggerRedactPaths: string[];
  nodeEnv: string;
  port: number;
}

function getConfig(): Config {
  if (!process.env.APP_ENV) {
    process.env.APP_ENV = "development";
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }

  const configPath = resolve(process.cwd(), `configs/${process.env.APP_ENV}.env`);
  const result = config({
    path: configPath,
  });

  return {
    appkitEnv: process.env.APP_ENV || "development",
    configPath: result?.error ? "" : configPath,
    host: process.env.APP_HOST || "0.0.0.0",
    loggerRedactPaths: process.env.APP_LOGGER_REDACT_PATHS
      ? process.env.APP_LOGGER_REDACT_PATHS.split(",")
      : [],
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.APP_PORT || "") || 3000,
  };
}

export default getConfig();
