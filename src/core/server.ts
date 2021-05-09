import type { default as IRouter } from "@koa/router";
import type { HttpRequest, HttpResponse, RecognizedString, TemplatedApp, us_listen_socket } from "uWebSockets.js";
import type { ViteDevServer } from "vite";

import tinyGlob from "tiny-glob";
import Router from "@koa/router";
import uWebSockets from "uWebSockets.js";
import { createServer } from "vite";
const { App, us_listen_socket_close } = uWebSockets;

import { config, logger } from "../globals";
import { getRouterPathFromFilename } from "./util";

declare module "uWebSockets.js" {
  interface HttpResponse {
    isAborted: boolean;
    // eslint-disable-next-line
    json: (obj: any, status?: string | number) => void;
  }

  interface HttpRequest {
    // eslint-disable-next-line
    ctx: { [key: string]: any };
    // eslint-disable-next-line
    params: { [key: string]: any };
  }

  interface TemplatedApp {
    // To allow dynamic route setup in Server#initRoutes().
    [key: string]: (pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void) => TemplatedApp;
  }
}

export type { HttpRequest, HttpResponse } from "uWebSockets.js";
export type Handler = (req: HttpRequest, res: HttpResponse) => Promise<void>;
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
        `${config.routesPath}/**/!(*.spec|*.test).${config.nodeEnv === "development" ? "{md,mdx,ts,svelte}" : "{js}"}`,
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
                ["any", "connect", "del", "get", "head", "options", "patch", "post", "put", "trace"].indexOf(method) < 0
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
              // eslint-disable-next-line
              this.#router[method](path, () => {});
            }
          }
        }),
      ]);

      // Use @koa/router to better handle the routing.
      this.#server.any("/*", (res: HttpResponse, req: HttpRequest) => {
        const match = this.#router.match(req.getUrl(), req.getMethod());

        if (!match || !match.path || match.path.length < 1) {
          return res.writeStatus("404").end("");
        }

        const route = this.#routes[`${req.getMethod()} ${match.path[0].path}`];

        // Setup HttpRequest helpers.
        req.ctx = {};

        // Setup HttpResponse helpers.
        res.isAborted = false;
        res.onAborted(() => (res.isAborted = true));

        // Setup the HttpRequest params.
        req.params = match.path[0].params(req.getUrl(), match.path[0]?.captures(req.getUrl())) || {};

        // eslint-disable-next-line
        res.__proto__.json = function (obj: any, status = "200") {
          if (this.isAborted) return;

          this.cork(() => {
            this.writeStatus(status.toString())
              .writeHeader("Content-Type", "application/json")
              .end(JSON.stringify(obj));
          });
        };

        if (route.handler.constructor.name === "AsyncFunction") {
          return route.handler(req, res).catch((err: Error) => logger.error(err));
        }

        return route.handler(req, res);
      });
    } catch (err) {
      if (config.nodeEnv === "test") return;
      logger.error(err);
    }
  }

  async initViteDevServer(): Promise<void> {
    this.#vite = await createServer();
  }

  async listen(
    host: RecognizedString,
    port: number,
    cb: (listenSocket: us_listen_socket) => void
  ): Promise<TemplatedApp> {
    return this.#server.listen(host, port, cb);
  }
}

export async function getServer(): Promise<Server> {
  const server = new Server();
  await server.init();

  return server;
}
