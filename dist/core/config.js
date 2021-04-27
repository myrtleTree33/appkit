import { config } from "dotenv";
import { resolve } from "path";
export function getConfig() {
    if (!process.env.APPKIT_ENV) {
        process.env.APPKIT_ENV = "development";
    }
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = "development";
    }
    const configPath = resolve(process.cwd(), `configs/${process.env.APPKIT_ENV}.env`);
    config({
        path: configPath,
    });
    return {
        appkitEnv: process.env.APPKIT_ENV || "development",
        configPath: configPath.replace(`${process.cwd()}/`, ""),
        host: process.env.APPKIT_HOST || "0.0.0.0",
        loggerRedactPaths: process.env.APPKIT_LOGGER_REDACT_PATHS ? process.env.APPKIT_LOGGER_REDACT_PATHS.split(",") : [],
        nodeEnv: process.env.NODE_ENV || "development",
        port: parseInt(process.env.APPKIT_PORT || "") || 3000,
    };
}
export default getConfig();
