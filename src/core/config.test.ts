import path from "path";

describe("config", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("returns the default value", () => {
    jest.isolateModules(() => {
      delete process.env.NODE_ENV;
      const config = require("./config").default;

      expect(config).toEqual({
        appkitEnv: "development",
        configPath: "",
        loggerRedactPaths: [],
        host: "0.0.0.0",
        nodeEnv: "development",
        port: 3000,
      });
    });
  });

  test("returns the value from '__fixtures__/production.env'", () => {
    jest.isolateModules(() => {
      process.env.APPKIT_ENV = "production";
      const configPath = `${__dirname}/__fixtures__/production.env`;
      const configSpy = jest.spyOn(path, "resolve").mockReturnValueOnce(configPath);
      const config = require("./config").default;

      expect(config).toEqual({
        appkitEnv: "production",
        configPath: configPath.replace(`${process.cwd()}/`, ""),
        loggerRedactPaths: ["a", "b.c", "d.e.f"],
        host: "1.1.1.1",
        nodeEnv: "test",
        port: 5000,
      });
      expect(process.env.APPKIT_DB_URI_PRIMARY).toEqual("mysql://main:whatever@0.0.0.0:33306/main");

      configSpy.mockRestore();
    });
  });

  test("overrides the value from '__fixtures__/production.env'", () => {
    jest.isolateModules(() => {
      process.env.APPKIT_ENV = "production";
      process.env.APPKIT_DB_URI_PRIMARY = "db_uri_primary";
      const configPath = `${__dirname}/__fixtures__/production.env`;
      const configSpy = jest.spyOn(path, "resolve").mockReturnValueOnce(configPath);
      const config = require("./config").default;

      expect(config).toEqual({
        appkitEnv: "production",
        configPath: configPath.replace(`${process.cwd()}/`, ""),
        loggerRedactPaths: ["a", "b.c", "d.e.f"],
        host: "1.1.1.1",
        nodeEnv: "test",
        port: 5000,
      });
      expect(process.env.APPKIT_DB_URI_PRIMARY).toEqual("db_uri_primary");

      configSpy.mockRestore();
    });
  });

  test("returns empty config path if dotenv loading failed", () => {
    jest.isolateModules(() => {
      const config = require("./config").default;

      expect(config).toEqual({
        appkitEnv: "development",
        configPath: "",
        loggerRedactPaths: [],
        host: "0.0.0.0",
        nodeEnv: "test",
        port: 3000,
      });
    });
  });
});
