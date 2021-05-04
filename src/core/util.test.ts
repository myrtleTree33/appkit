describe("util", () => {
  test("returns the default value", () => {
    jest.isolateModules(async () => {
      const { getRouteFromFilename } = require("./util");
    });
  });
});
