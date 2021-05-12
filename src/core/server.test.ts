import supertest from "supertest";

describe("server", () => {
  const OLD_ENV = process.env;
  let cwdSpy, server;

  describe("when NODE_ENV equals to 'development'", () => {
    beforeAll(async () => {
      process.env = { ...OLD_ENV, NODE_ENV: "development" };
      cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(`${__dirname}/__fixtures__`);

      const { getServer } = require("./server");
      server = await getServer();
    });

    afterAll(async () => {
      await server.close();
      cwdSpy.mockRestore();
      process.env = OLD_ENV;
      jest.resetModules();
    });

    test("server.address() should be '0.0.0.0:3000'", () => expect(server.address()).toBe("0.0.0.0:3000"));
  });

  describe.skip("when NODE_ENV equals to 'production'", () => {
    beforeAll(async () => {
      process.env = { ...OLD_ENV, NODE_ENV: "production" };
      cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(`${__dirname}/__fixtures__`);

      const { getServer } = require("./server");
      server = await getServer();
    });

    afterAll(async () => {
      await server.close();
      cwdSpy.mockRestore();
      process.env = OLD_ENV;
      jest.resetModules();
    });

    test("server.address() should be '0.0.0.0:5000'", () => expect(server.address()).toBe("0.0.0.0:5000"));
  });
});
