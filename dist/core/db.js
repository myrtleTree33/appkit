import knex from "knex";
import { resolve } from "path";
const DB_URI_PREFIX = "APPKIT_DB_URI_";
const DB_POOL_PREFIX = "APPKIT_DB_POOL_";
export function getDB() {
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
            db[dbName.toLowerCase()] = knex({
                client,
                connection: dbUri,
                pool: { min: dbPool, max: dbPool },
                migrations: {
                    directory: resolve(process.cwd(), `db/migrate/${dbName.toLowerCase()}`),
                    tableName: "schema_migrations",
                    loadExtensions: [".cjs"],
                },
                seeds: {
                    directory: resolve(process.cwd(), `db/seed/${dbName.toLowerCase()}`),
                    loadExtensions: [".cjs"],
                },
            });
        }
    }
    return db;
}
export default getDB();
