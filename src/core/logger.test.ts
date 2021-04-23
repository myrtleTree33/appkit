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
      const logger = require("./logger").default;

      expect(logger.level).toBe("debug");
    });
  });

  test("returns the logger for production mode", () => {
    jest.isolateModules(() => {
      const logger = require("./logger").default;

      expect(logger.level).toBe("info");
    });
  });
});
