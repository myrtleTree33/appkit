import superagent from "superagent";

describe("server", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    jest.mock("./logger");
  });

  afterAll(() => {
    jest.unmock("./logger");
  });

  describe("when APPKIT_ENV and NODE_ENV equals to 'development'", () => {
    let cwdSpy, res, server;

    beforeAll(async () => {
      process.env = { ...OLD_ENV, APPKIT_ENV: "development", NODE_ENV: "development" };
      cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(`${__dirname}/__fixtures__`);

      const { getServer } = require("./server");
      server = await getServer();
      server.listen();
    });

    afterAll(async () => {
      await server.close();
      cwdSpy.mockRestore();
      process.env = OLD_ENV;
      jest.resetModules();
    });

    describe("hitting 'GET /appist/appkit/tree/master/documentation/docs/routing-01.md'", () => {
      beforeAll(async () => {
        const path = "/appist/appkit/tree/master/documentation/docs/routing-01.md";
        res = await superagent.get(`http://${server.address()}${path}`).send();
      });

      test("should return body with source equals to 'ts'", () => expect(res.body.source).toBe("ts"));
      test("should return body with no cookies", () => expect(res.body.cookies).toBeUndefined());
      test("should return body with the empty query string params", () => expect(res.body.query).toEqual({}));
      test("should return body with the headers", () =>
        expect(res.body.headers).toEqual({
          "accept-encoding": "gzip, deflate",
          connection: "close",
          host: "0.0.0.0:3000",
        }));
      test("should return body with the params", () =>
        expect(res.body.params).toEqual({
          org: "appist",
          repo: "appkit",
          branch: "master",
          file: "documentation/docs/routing-01.md",
        }));
    });
  });

  describe("when APPKIT_ENV and NODE_ENV equals to 'production'", () => {
    let cwdSpy, res, server;

    beforeAll(async () => {
      process.env = { ...OLD_ENV, APPKIT_ENV: "production", NODE_ENV: "production" };
      cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(`${__dirname}/__fixtures__`);

      const { getServer } = require("./server");
      server = await getServer();
      server.listen();
    });

    afterAll(async () => {
      await server.close();
      cwdSpy.mockRestore();
      process.env = OLD_ENV;
      jest.resetModules();
    });

    describe("hitting 'GET /appist/appkit/tree/master/documentation/docs/routing-01.md'", () => {
      beforeAll(async () => {
        const path = "/appist/appkit/tree/master/documentation/docs/routing-01.md";
        res = await superagent.get(`http://${server.address()}${path}`).send();
      });

      test("should return body with source equals to 'js'", () => expect(res.body.source).toBe("js"));
      test("should return body with no cookies", () => expect(res.body.cookies).toBeUndefined());
      test("should return body with the empty query string params", () => expect(res.body.query).toEqual({}));
      test("should return body with the headers", () =>
        expect(res.body.headers).toEqual({
          "accept-encoding": "gzip, deflate",
          connection: "close",
          host: "0.0.0.0:5000",
        }));
      test("should return body with the params", () =>
        expect(res.body.params).toEqual({
          org: "appist",
          repo: "appkit",
          branch: "master",
          file: "documentation/docs/routing-01.md",
        }));
    });
  });
});
