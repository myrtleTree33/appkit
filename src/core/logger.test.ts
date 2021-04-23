describe("logger", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("returns the logger for development mode", () => {
    jest.isolateModules(() => {
      process.env.NODE_ENV = "development";
      const { getLogger } = require("./logger");
      const logger = getLogger();

      expect(logger.level).toBe("debug");
    });
  });

  test("returns the logger for production mode", () => {
    jest.isolateModules(() => {
      const { getLogger } = require("./logger");
      const logger = getLogger();

      expect(logger.level).toBe("info");
    });
  });
});
