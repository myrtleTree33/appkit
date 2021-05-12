import type { Server } from "./server";
import superagent, { Response, ResponseError } from "superagent";

describe("server", () => {
  const OLD_ENV = process.env;
  const GET_PATH =
    "/appist/appkit/tree/master/documentation/docs/routing-01.md?order=desc&shoe[color]=blue&shoe[type]=converse";
  const POST_PATH = "/foo";

  beforeAll(() => {
    jest.mock("./logger");
  });

  afterAll(() => {
    jest.unmock("./logger");
  });

  describe("when APPKIT_ENV and NODE_ENV equals to 'development'", () => {
    let cwdSpy: jest.SpyInstance, res: Response, server: Server;

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

    describe("hitting non-existent path", () => {
      let err: ResponseError;

      beforeAll(async () => {
        try {
          await superagent.get(`http://${server.address()}/foobar`).send();
        } catch (e) {
          err = e;
        }
      });

      test("should return status code = 404", async () => expect(err.status).toBe(404));
    });

    describe(`hitting 'GET ${GET_PATH}'`, () => {
      beforeAll(async () => {
        res = await superagent
          .get(`http://${server.address()}${GET_PATH}`)
          .set({ cookie: "a=1; b=2;" })
          .send();
      });

      test("should return status code = 200", () => expect(res.status).toBe(200));
      test("should return body with source = 'ts'", () => expect(res.body.source).toBe("ts"));
      test("should return body with the cookies", () =>
        expect(res.body.cookies).toEqual({
          a: "1",
          b: "2",
        }));
      test("should return body with the headers", () =>
        expect(res.body.headers).toEqual({
          "accept-encoding": "gzip, deflate",
          connection: "close",
          cookie: "a=1; b=2;",
          host: "0.0.0.0:3000",
        }));
      test("should return body with the params", () =>
        expect(res.body.params).toEqual({
          org: "appist",
          repo: "appkit",
          branch: "master",
          file: "documentation/docs/routing-01.md",
        }));
      test("should return body with the query string params", () =>
        expect(res.body.query).toEqual({
          order: "desc",
          shoe: {
            color: "blue",
            type: "converse",
          },
        }));
    });

    describe(`hitting 'GET ${POST_PATH}' (without defined handler)`, () => {
      let err: ResponseError;

      beforeAll(async () => {
        try {
          await superagent.get(`http://${server.address()}${POST_PATH}`).send();
        } catch (e) {
          err = e;
        }
      });

      test("should return status code = 404", async () => expect(err.status).toBe(404));
    });

    describe(`hitting 'POST ${POST_PATH}' (with defined handler)`, () => {
      beforeAll(async () => {
        res = await superagent.post(`http://${server.address()}${POST_PATH}`).send();
      });

      test("should return status code = 200", () => expect(res.status).toBe(200));
      test("should return body with source = 'ts'", () => expect(res.body.source).toBe("ts"));
      test("should return body with foo = 'bar'", () => expect(res.body.foo).toBe("bar"));
    });
  });

  describe("when APPKIT_ENV and NODE_ENV equals to 'production'", () => {
    let cwdSpy: jest.SpyInstance, res: Response, server: Server;

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

    describe("hitting non-existent path", () => {
      let err: ResponseError;

      beforeAll(async () => {
        try {
          await superagent.get(`http://${server.address()}/foobar`).send();
        } catch (e) {
          err = e;
        }
      });

      test("should return status code = 404", async () => expect(err.status).toBe(404));
    });

    describe(`hitting 'GET ${GET_PATH}'`, () => {
      beforeAll(async () => {
        res = await superagent
          .get(`http://${server.address()}${GET_PATH}`)
          .set({ cookie: "a=1; b=2;" })
          .send();
      });

      test("should return status code = 200", () => expect(res.status).toBe(200));
      test("should return body with source = 'js'", () => expect(res.body.source).toBe("js"));
      test("should return body with the cookies", () =>
        expect(res.body.cookies).toEqual({
          a: "1",
          b: "2",
        }));
      test("should return body with the headers", () =>
        expect(res.body.headers).toEqual({
          "accept-encoding": "gzip, deflate",
          connection: "close",
          cookie: "a=1; b=2;",
          host: "0.0.0.0:5000",
        }));
      test("should return body with the params", () =>
        expect(res.body.params).toEqual({
          org: "appist",
          repo: "appkit",
          branch: "master",
          file: "documentation/docs/routing-01.md",
        }));
      test("should return body with the query string params", () =>
        expect(res.body.query).toEqual({
          order: "desc",
          shoe: {
            color: "blue",
            type: "converse",
          },
        }));
    });

    describe(`hitting 'GET ${POST_PATH}' (without defined handler)`, () => {
      let err: ResponseError;

      beforeAll(async () => {
        try {
          await superagent.get(`http://${server.address()}${POST_PATH}`).send();
        } catch (e) {
          err = e;
        }
      });

      test("should return status code = 404", async () => expect(err.status).toBe(404));
    });

    describe(`hitting 'POST ${POST_PATH}' (with defined handler)`, () => {
      beforeAll(async () => {
        res = await superagent.post(`http://${server.address()}${POST_PATH}`).send();
      });

      test("should return status code = 200", () => expect(res.status).toBe(200));
      test("should return body with source = 'js'", () => expect(res.body.source).toBe("js"));
      test("should return body with foo = 'bar'", () => expect(res.body.foo).toBe("bar"));
    });
  });
});
