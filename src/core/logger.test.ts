import type { Logger } from "./logger";

describe("logger", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetModules();
  });

  test("returns the logger for development mode", () => {
    process.env.NODE_ENV = "development";
    const { getLogger } = require("./logger");
    const logger: Logger = getLogger();

    expect(logger.level).toBe("debug");
  });

  test("returns the logger for production mode", () => {
    const { getLogger } = require("./logger");
    const logger: Logger = getLogger();

    expect(logger.level).toBe("info");
  });
});
