import type { HttpRequest, HttpResponse, RecognizedString, TemplatedApp, us_listen_socket } from "uWebSockets.js";
import type { ViteDevServer } from "vite";

import tinyGlob from "tiny-glob";
import { createServer } from "vite";
import uWebSockets from "uWebSockets.js";
const { App, us_listen_socket_close } = uWebSockets;

import { config, logger } from "../..";
import { getRouteFromFilename, srcRoutes } from "./util";

declare module "uWebSockets.js" {
  interface HttpResponse {
    isAborted: boolean;
    isRendered: boolean;
    json: (obj: any, status?: string | number) => void;
  }

  interface HttpRequest {
    ctx: { [key: string]: any };
  }

  interface TemplatedApp {
    // To allow dynamic route setup in Server#initRoutes().
    [key: string]: (pattern: RecognizedString, handler: Handler) => TemplatedApp;
  }
}

export type { HttpRequest, HttpResponse } from "uWebSockets.js";
export type Handler = (res: HttpResponse, req: HttpRequest) => void;
export type Routes = { [key: string]: Route };

export interface Route {
  method: string;
  path: string;
  handler: Handler;
}

export class Server {
  #timestamp: string;
  #listenSocket: us_listen_socket | null;
  #server: TemplatedApp;
  #vite: ViteDevServer | null;
  #routes: Routes;

  constructor() {
    this.#listenSocket = null;
    this.#server = App();
    this.#vite = null;
    this.#routes = {};
    this.#timestamp = "";
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

  async close(): Promise<void> {
    if (!this.#listenSocket) return;
    us_listen_socket_close(this.#listenSocket);
    this.#listenSocket = null;
    await this.#vite?.close();
  }

  async init(): Promise<void> {
    await this.initRoutes();
    await this.initViteDevServer();
  }

  async initRoutes(): Promise<void> {
    try {
      const files = await tinyGlob(
        `${srcRoutes}/**/!(*.spec|*.test).${config.nodeEnv === "development" ? "{md,mdx,ts,svelte}" : "{js}"}`,
        {
          absolute: true,
          filesOnly: true,
        }
      );

      await Promise.all([
        files.map(async (fn: string) => {
          if (fn.endsWith(config.nodeEnv === "development" ? ".ts" : ".js")) {
            const mod = await import(fn);
            const route = getRouteFromFilename(fn);

            for (const key of Object.keys(mod)) {
              if (
                typeof mod[key] !== "function" ||
                ["any", "connect", "del", "get", "head", "options", "patch", "post", "put", "trace"].indexOf(key) < 0
              ) {
                continue;
              }

              this.#server[key](route, (res: HttpResponse, req: HttpRequest) => {
                // Setup HttpRequest helpers.
                req.ctx = {};

                // Setup HttpResponse helpers.
                res.isAborted = false;
                res.onAborted(() => (res.isAborted = true));

                res.isRendered = false;
                res.__proto__.json = function (obj: any, status = "200") {
                  if (this.isAborted) return;

                  res
                    .writeStatus(status.toString())
                    .writeHeader("Content-Type", "application/json")
                    .end(JSON.stringify(obj));

                  res.isRendered = true;
                };

                if (mod[key].constructor.name === "AsyncFunction") {
                  mod[key](req, res).catch((err: Error) => logger.error(err));
                  return;
                }

                mod[key](req, res);
              });
            }
          }
        }),
      ]);
    } catch (err) {
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
