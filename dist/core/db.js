import knex from "knex";
import { getConfig } from "./config";
const DB_URI_PREFIX = "APPKIT_DB_URI_";
const DB_POOL_PREFIX = "APPKIT_DB_POOL_";
export function getDB() {
    const config = getConfig();
    const db = { primary: null };
    for (const envKey in process.env) {
        if (envKey.startsWith(DB_URI_PREFIX)) {
            const dbUri = process.env[envKey];
            if (!dbUri)
                continue;
            const dbName = envKey.replace(DB_URI_PREFIX, "");
            const dbPool = parseInt(process.env[`${DB_POOL_PREFIX}${dbName}`] || "10");
            let client = "sqlite3";
            if (dbUri.startsWith("mysql")) {
                client = "mysql2";
            }
            else if (dbUri.startsWith("postgres")) {
                client = "postgres";
            }
            const extension = config.nodeEnv === "development" ? "ts" : "js";
            const loadExtensions = config.nodeEnv === "development" ? [".ts"] : [".js"];
            // Workaround for loading `.ts` migration/seed files. https://github.com/knex/knex/issues/4447
            // process.env.npm_package_type = "module";
            db[dbName.toLowerCase()] = knex({
                client,
                connection: dbUri,
                pool: { min: dbPool, max: dbPool },
                migrations: {
                    directory: `${config.entryRoot}/db/migrate/${dbName.toLowerCase()}`,
                    extension,
                    tableName: "schema_migrations",
                    loadExtensions,
                },
                seeds: {
                    directory: `${config.entryRoot}/db/seed/${dbName.toLowerCase()}`,
                    extension,
                    loadExtensions,
                },
            });
        }
    }
    return db;
}
