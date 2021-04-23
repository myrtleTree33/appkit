import { resolve } from "path";

describe("db", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("uses the DB config from the environment variables", () => {
    jest.isolateModules(() => {
      process.env.APPKIT_DB_URI_PRIMARY = "mysql://main:whatever@0.0.0.0:3306/main";
      process.env.APPKIT_DB_POOL_PRIMARY = "16";
      process.env.APPKIT_DB_URI_SECONDARY =
        "postgresql://main:whatever@0.0.0.0:5432/main?sslmode=disable&connect_timeout=5";
      process.env.APPKIT_DB_POOL_SECONDARY = "32";
      const { getDB } = require("./db");
      const db = getDB();

      expect(db["primary"].client.config).toEqual({
        client: "mysql2",
        connection: {
          database: "main",
          host: "0.0.0.0",
          port: "3306",
          user: "main",
          password: "whatever",
        },
        pool: { min: 16, max: 16 },
        migrations: {
          directory: resolve(process.cwd(), "db/migrate/primary"),
          tableName: "schema_migrations",
          loadExtensions: [".cjs"],
        },
        seeds: {
          directory: resolve(process.cwd(), "db/seed/primary"),
          loadExtensions: [".cjs"],
        },
      });

      expect(db["secondary"].client.config).toEqual({
        client: "postgres",
        connection: {
          connect_timeout: "5",
          database: "main",
          host: "0.0.0.0",
          port: "5432",
          user: "main",
          password: "whatever",
          ssl: false,
          sslmode: "disable",
        },
        pool: { min: 32, max: 32 },
        migrations: {
          directory: resolve(process.cwd(), "db/migrate/secondary"),
          tableName: "schema_migrations",
          loadExtensions: [".cjs"],
        },
        seeds: {
          directory: resolve(process.cwd(), "db/seed/secondary"),
          loadExtensions: [".cjs"],
        },
      });
    });
  });
});
