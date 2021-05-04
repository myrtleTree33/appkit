describe("server", () => {
  test("returns the default value", () => {
    jest.isolateModules(async () => {
      const { getServer } = require("./server");
    });
  });
});
