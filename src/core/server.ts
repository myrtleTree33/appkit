import type { default as IRouter } from "@koa/router";
import type { CookieSerializeOptions } from "cookie";
import type { HttpRequest, HttpResponse, TemplatedApp, us_listen_socket } from "uWebSockets.js";
import type { ViteDevServer } from "vite";

import Router from "@koa/router";
import cookie from "cookie";
import cookieParser from "cookie-parser";
import { sign } from "cookie-signature";
import qs from "qs";
import tinyGlob from "tiny-glob";
import uWebSockets from "uWebSockets.js";
import { createServer } from "vite";
const { App, us_listen_socket_close } = uWebSockets;

import { config, logger } from "../globals";
import { getRouterPathFromFilename } from "./util";

declare module "cookie" {
  interface CookieSerializeOptions {
    /**
     * Indicates if the cookie should be signed.
     */
    signed?: boolean;
  }
}

declare module "uWebSockets.js" {
  interface HttpResponse {
    /**
     * Indicates if a response is aborted for skipping the response sending.
     */
    isAborted: boolean;

    /**
     * Sets cookie `name` to `value`. The value parameter may be a string or object converted to JSON.
     */
    cookie: (name: string, value: string | unknown, opts: CookieSerializeOptions) => HttpResponse;

    /**
     * Sends a JSON response.
     */
    json: (obj: unknown, status?: number) => void;
  }

  interface HttpRequest {
    /**
     * Contains key-value pairs in the request cookies. By default, it is {}.
     */
    cookies: { [key: string]: string };

    /**
     * Contains key-value pairs in the request cookies that are signed. By default, it is {}.
     */
    signedCookies: { [key: string]: string };

    ctx: { [key: string]: unknown };

    /**
     * Contains key-value pairs in the request headers. Note that the key must be lower case. By
     * default, it is {}.
     */
    headers: { [key: string]: string };

    /**
     * Contains a string corresponding to the HTTP method of the request: GET, POST, PUT, and so
     * on.
     */
    method: string;

    /**
     * Contains key-value pairs mapped to the route's named parameters. For example, if the route
     * is "/user/:name", then the "name" property is available as req.params.name. By default, it
     * is {}.
     */
    params: { [key: string]: string };

    /**
     * Contains the path part of the request URL. For example, if the request URL is
     * http://api.dev/user, then the path will be "/user".
     */
    path: string;

    /**
     * Contains key-value pairs mapped to the route's query string parameters. For example, if the
     * query string is "/shoes?order=desc&shoe[color]=blue&shoe[type]=converse", then "req.query"
     * will be { "shoe": { "color": "blue", "type": "converse" } }.
     */
    query: { [key: string]: unknown };
  }

  interface TemplatedApp {
    // To allow dynamic route setup in Server#initRoutes().
    [key: string]: (
      pattern: RecognizedString,
      handler: (res: HttpResponse, req: HttpRequest) => void
    ) => TemplatedApp;
  }
}

type Handler = (req: HttpRequest, res: HttpResponse) => Promise<void>;
export type { CookieSerializeOptions } from "cookie";
export type { HttpRequest, HttpResponse } from "uWebSockets.js";
export type Routes = { [key: string]: Route };

export interface Route {
  method: string;
  path: string;
  handler: Handler;
}

export class Server {
  #listenSocket: us_listen_socket | null;
  #server: TemplatedApp;
  #vite: ViteDevServer | null;
  #router: IRouter;
  #routes: Routes;

  constructor() {
    this.#listenSocket = null;
    this.#server = App();
    this.#vite = null;
    this.#router = new Router();
    this.#routes = {};
  }

  public get listenSocket(): us_listen_socket | null {
    return this.#listenSocket;
  }

  public set listenSocket(_listenSocket: us_listen_socket | null) {
    this.#listenSocket = _listenSocket;
  }

  public get routes(): Routes {
    return this.#routes;
  }

  address(): string {
    return `${config.host}:${config.port}`;
  }

  async close(): Promise<void> {
    await this.#vite?.close();
    if (!this.#listenSocket) return;
    us_listen_socket_close(this.#listenSocket);
    this.#listenSocket = null;
  }

  async init(): Promise<void> {
    await this.initRoutes();
    await this.initViteDevServer();
  }

  async initRoutes(): Promise<void> {
    try {
      const files = await tinyGlob(
        `${config.routesPath}/**/!(*.spec|*.test).${
          config.nodeEnv === "development" ? "{md,mdx,ts,svelte}" : "{js}"
        }`,
        {
          absolute: true,
          filesOnly: true,
        }
      );

      await Promise.all([
        files.map(async (fn: string) => {
          if (fn.endsWith(config.nodeEnv === "development" ? ".ts" : ".js")) {
            const mod = await import(fn);
            const path = getRouterPathFromFilename(fn);

            for (const method of Object.keys(mod)) {
              if (
                typeof mod[method] !== "function" ||
                [
                  "any",
                  "connect",
                  "del",
                  "get",
                  "head",
                  "options",
                  "patch",
                  "post",
                  "put",
                  "trace",
                ].indexOf(method) < 0
              ) {
                continue;
              }

              this.#routes[`${method} ${path}`] = {
                method,
                path,
                handler: mod[method],
              };

              // eslint-disable-next-line
              // @ts-ignore
              this.#router[method](path, () => {
                // Don't need to anything as we are only using the route matching due to the route
                // matching from uWebSockets.js doesn't meet our need.
              });
            }
          }
        }),
      ]);

      // Use @koa/router to better handle the route matching.
      this.#server.any("/*", (res: HttpResponse, req: HttpRequest) => {
        const match = this.#router.match(req.getUrl(), req.getMethod());

        if (
          !match ||
          !match.path ||
          match.path.length < 1 ||
          !this.#routes[`${req.getMethod()} ${match.path[0].path}`]?.handler
        ) {
          return res.writeStatus("404").end("");
        }

        const route = this.#routes[`${req.getMethod()} ${match.path[0].path}`];
        extendRequest(match, req, res);
        extendResponse(match, req, res);

        if (route.handler.constructor.name === "AsyncFunction") {
          return route.handler(req, res).catch((err: Error) => logger.error(err));
        }

        return route.handler(req, res);
      });
    } catch (err) {
      logger.error(err);
    }
  }

  async initViteDevServer(): Promise<void> {
    this.#vite = await createServer();
  }

  listen(cb?: () => void): TemplatedApp {
    this.#server.listen(config.host, config.port, (socket: us_listen_socket): void => {
      if (socket) {
        this.#listenSocket = socket;
        logger.info(`Server is listening on http://${config.host}:${config.port}...`);
      }

      if (cb) cb();
    });

    return this.#server;
  }
}

export async function getServer(): Promise<Server> {
  const server = new Server();
  await server.init();

  return server;
}

function extendRequest(match: IRouter.RoutesMatch, req: HttpRequest, res: HttpResponse) {
  // Set the request context.
  req.ctx = {};

  // Set the request headers.
  req.headers = {};
  req.forEach((k, v) => (req.headers[k] = v));

  // Set the request cookies and signed cookies.
  if (req.headers["cookie"]) {
    cookieParser(config.signedCookiesSecret)(
      // eslint-disable-next-line
      // @ts-ignore
      req,
      res,
      () => {
        // Not doing anything as we only need to set req.cookies and req.signedCookies.
      }
    );
  }

  // Set the request method.
  req.method = req.getMethod();

  // Set the request path.
  req.path = req.getUrl();

  // Set the request params.
  const params = match.path[0]?.captures(req.getUrl());
  req.getParameter = function (index: number): string {
    return index < params.length ? params[index] : "";
  };
  req.params = (match.path[0].params(req.getUrl(), params) as { [key: string]: string }) || {};

  // Set the request query string params.
  req.query = qs.parse(req.getQuery());
}

function extendResponse(match: IRouter.RoutesMatch, req: HttpRequest, res: HttpResponse) {
  // Initialise onAborted handler which is required by uWebockets.js for async/await requests.
  res.isAborted = false;
  res.onAborted(() => (res.isAborted = true));

  // Attach cookie response helper.
  res.__proto__.cookie = function (
    name: string,
    value: string | unknown,
    opts: CookieSerializeOptions = {}
  ): HttpResponse {
    if (opts.signed && !config.signedCookiesSecret) {
      logger.warn(
        `Skipping ${name}=${JSON.stringify(
          value
        )} signed cookies setting as APPKIT_SIGNED_COOKIES_SECRET isn't configured.`
      );
      return this;
    }

    let val = typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

    if (opts.signed) {
      val = "s:" + sign(val, config.signedCookiesSecret);
    }

    if (opts.maxAge) {
      opts.expires = new Date(Date.now() + opts.maxAge);
      opts.maxAge /= 1000;
    }

    if (opts.path == null) {
      opts.path = "/";
    }

    this.writeHeader("Set-Cookie", cookie.serialize(name, String(val), opts));
    return this;
  };

  // Attach JSON response helper.
  res.__proto__.json = function (obj: unknown, status = 200) {
    if (this.isAborted) return;

    this.cork(() => {
      this.writeStatus(status.toString())
        .writeHeader("Content-Type", "application/json")
        .end(JSON.stringify(obj));
    });
  };
}
