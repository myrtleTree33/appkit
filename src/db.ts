import knex, { Knex } from "knex";
import { resolve } from "path";
import logger from "./logger";

export interface DB {
  primary: Knex | null;
  [key: string]: Knex | null;
}

export interface DBConfig {
  primary: Knex.Config | null;
  [key: string]: Knex.Config | null;
}

export const config: DBConfig = {
  primary: null,
};

const DB_URI_PREFIX = "DB_URI_";
const DB_POOL_PREFIX = "DB_POOL_";

for (let envKey in process.env) {
  if (envKey.startsWith(DB_URI_PREFIX)) {
    const dbUri = process.env[envKey];
    if (!dbUri) continue;

    const dbName = envKey.replace(DB_URI_PREFIX, "");
    const dbPool = process.env[`${DB_POOL_PREFIX}_${dbName}`]
      ? parseInt(process.env[`${DB_POOL_PREFIX}_${dbName}`] || "10")
      : 10;

    let client: string = "sqlite3";
    if (dbUri.startsWith("mysql")) {
      client = "mysql2";
    } else if (dbUri.startsWith("postgres")) {
      client = "postgres";
    }

    config[dbName.toLowerCase()] = {
      client,
      connection: dbUri,
      pool: { min: dbPool, max: dbPool },
      log: logger,
      migrations: {
        directory: resolve(process.cwd(), `db/migrate/${dbName.toLowerCase()}`),
        extension: "ts",
        loadExtensions: [".ts"],
        tableName: "schema_migrations",
      },
      seeds: {
        directory: resolve(process.cwd(), `db/seed/${dbName.toLowerCase()}`),
        extension: "ts",
        loadExtensions: [".ts"],
      },
    };
  }
}

function getDB(): DB {
  return {
    primary: config.primary ? knex(config.primary) : null,
  };
}

export default getDB();
