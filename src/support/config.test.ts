import path from "path";

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
