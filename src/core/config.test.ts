import type { Config } from "./config";

describe("config", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetModules();
  });

  test("returns the default value", () => {
    delete process.env.NODE_ENV;
    const { getConfig } = require("./config");
    const config: Config = getConfig();

    expect(config).toEqual({
      appkitEnv: "development",
      configPath: "configs/development.env",
      entryRoot: `${process.cwd()}/src`,
      loggerRedactPaths: [],
      host: "0.0.0.0",
      nodeEnv: "development",
      port: 3000,
      routesPath: `${process.cwd()}/src/routes`,
      signedCookiesSecret: "",
    });
  });

  test("returns the value from '__fixtures__/configs/production.env'", () => {
    process.env.APPKIT_ENV = "production";
    const cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(`${__dirname}/__fixtures__`);
    const { getConfig } = require("./config");
    const config: Config = getConfig();

    expect(config).toEqual({
      appkitEnv: "production",
      configPath: "configs/production.env",
      entryRoot: `${process.cwd()}/dist`,
      loggerRedactPaths: ["a", "b.c", "d.e.f"],
      host: "1.1.1.1",
      nodeEnv: "test",
      port: 5000,
      routesPath: `${process.cwd()}/dist/routes`,
      signedCookiesSecret:
        "a7ab2500d4d7a52e66e07b883126773c8b147da8e4190c2b713fea1bbf47588dfbf1eac617d495e1430cc27cd1cb09af0827df7f58b68be6f69c2ebd63767813",
    });
    expect(process.env.APPKIT_DB_URI_PRIMARY).toEqual("mysql://main:whatever@0.0.0.0:33306/main");
    expect(process.env.APPKIT_DB_POOL_PRIMARY).toEqual("16");

    cwdSpy.mockRestore();
  });

  test("overrides the value from '__fixtures__/configs/production.env'", () => {
    process.env.APPKIT_ENV = "production";
    process.env.APPKIT_DB_URI_PRIMARY = "db_uri_primary";
    process.env.APPKIT_DB_POOL_PRIMARY = "32";
    const cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(`${__dirname}/__fixtures__`);
    const { getConfig } = require("./config");
    const config: Config = getConfig();

    expect(config).toEqual({
      appkitEnv: "production",
      configPath: "configs/production.env",
      entryRoot: `${process.cwd()}/dist`,
      loggerRedactPaths: ["a", "b.c", "d.e.f"],
      host: "1.1.1.1",
      nodeEnv: "test",
      port: 5000,
      routesPath: `${process.cwd()}/dist/routes`,
      signedCookiesSecret:
        "a7ab2500d4d7a52e66e07b883126773c8b147da8e4190c2b713fea1bbf47588dfbf1eac617d495e1430cc27cd1cb09af0827df7f58b68be6f69c2ebd63767813",
    });
    expect(process.env.APPKIT_DB_URI_PRIMARY).toEqual("db_uri_primary");
    expect(process.env.APPKIT_DB_POOL_PRIMARY).toEqual("32");

    cwdSpy.mockRestore();
  });

  test("returns default config path if dotenv loading failed", () => {
    const { getConfig } = require("./config");
    const config: Config = getConfig();

    expect(config).toEqual({
      appkitEnv: "development",
      configPath: "configs/development.env",
      entryRoot: `${process.cwd()}/dist`,
      loggerRedactPaths: [],
      host: "0.0.0.0",
      nodeEnv: "test",
      port: 3000,
      routesPath: `${process.cwd()}/dist/routes`,
      signedCookiesSecret: "",
    });
  });
});
