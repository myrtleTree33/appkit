import { config } from "dotenv";
import { resolve } from "path";

export interface Config {
  appkitEnv: string;
  envConfigPath: string;
  loggerRedactPaths: string[];
  nodeEnv: string;
  jwtSecret: string | undefined;
  host: string;
  port: number;
}

function getConfig(): Config {
  if (!process.env.APPKIT_ENV) {
    process.env.APPKIT_ENV = "development";
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }

  const configPath = resolve(process.cwd(), `configs/.env.${process.env.APPKIT_ENV}`);
  const result = config({
    path: configPath,
  });

  return {
    appkitEnv: process.env.APPKIT_ENV || "development",
    envConfigPath: result?.error ? "" : configPath,
    loggerRedactPaths: process.env.LOGGER_REDACT_PATHS
      ? process.env.LOGGER_REDACT_PATHS.split(",")
      : [],
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET,
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT || "") || 3000,
  };
}

export default getConfig();