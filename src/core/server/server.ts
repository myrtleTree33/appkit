import type {
  HttpRequest,
  HttpResponse,
  RecognizedString,
  TemplatedApp,
  WebSocketBehavior,
  us_listen_socket,
} from "uWebSockets.js";

import tinyGlob from "tiny-glob";
import { ViteDevServer } from "vite";
import { config, logger } from "..";
import uWebSockets from "uWebSockets.js";
import { getRouteFromFilename, srcRoutes } from "./util";
const { App, us_listen_socket_close } = uWebSockets;

declare module "uWebSockets.js" {
  interface HttpResponse {
    isAborted: boolean;
  }
}

export type { HttpRequest, HttpResponse } from "uWebSockets.js";
export type Handler = (res: HttpResponse, req: HttpRequest) => Promise<void>;
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
  #routes: Routes;

  constructor() {
    this.#listenSocket = null;
    this.#server = App({});
    this.#vite = null;
    this.#routes = {};
  }

  public get routes(): Routes {
    return this.#routes;
  }

  public get listenSocket(): us_listen_socket | null {
    return this.#listenSocket;
  }

  public set listenSocket(_listenSocket: us_listen_socket | null) {
    this.#listenSocket = _listenSocket;
  }

  any(pattern: RecognizedString, handler: Handler): TemplatedApp {
    return this.#server.any(pattern, handler);
  }

  connect(pattern: RecognizedString, handler: Handler): TemplatedApp {
    return this.#server.connect(pattern, handler);
  }

  del(pattern: RecognizedString, handler: Handler): TemplatedApp {
    return this.#server.del(pattern, handler);
  }

  get(pattern: RecognizedString, handler: Handler): TemplatedApp {
    return this.#server.get(pattern, handler);
  }

  head(pattern: RecognizedString, handler: Handler): TemplatedApp {
    return this.#server.head(pattern, handler);
  }

  options(pattern: RecognizedString, handler: Handler): TemplatedApp {
    return this.#server.options(pattern, handler);
  }

  patch(pattern: RecognizedString, handler: Handler): TemplatedApp {
    return this.#server.patch(pattern, handler);
  }

  post(pattern: RecognizedString, handler: Handler): TemplatedApp {
    return this.#server.post(pattern, handler);
  }

  put(pattern: RecognizedString, handler: Handler): TemplatedApp {
    return this.#server.put(pattern, handler);
  }

  trace(pattern: RecognizedString, handler: Handler): TemplatedApp {
    return this.#server.trace(pattern, handler);
  }

  async close(): Promise<void> {
    if (!this.#listenSocket) return;
    us_listen_socket_close(this.#listenSocket);
    this.#listenSocket = null;
    if (this.#vite?.httpServer?.listening) await this.#vite.close();
  }

  async listen(
    host: RecognizedString,
    port: number,
    cb: (listenSocket: us_listen_socket) => void
  ): Promise<TemplatedApp> {
    return this.#server.listen(host, port, cb);
  }

  numSubscribers(topic: RecognizedString): number {
    return this.#server.numSubscribers(topic);
  }

  publish(topic: RecognizedString, message: RecognizedString, isBinary?: boolean, compress?: boolean): boolean {
    return this.#server.publish(topic, message, isBinary, compress);
  }

  ws(pattern: RecognizedString, behavior: WebSocketBehavior): TemplatedApp {
    return this.#server.ws(pattern, behavior);
  }
}

async function getServer(): Promise<Server> {
  const server = new Server();

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
            if (typeof mod[key] !== "function") continue;

            switch (key) {
              case "connect":
                server.connect(route, async (res: HttpResponse, req: HttpRequest) => {
                  res.onAborted(() => (res.isAborted = true));
                  await mod[key](res, req);
                });

                break;

              case "del":
                server.del(route, async (res: HttpResponse, req: HttpRequest) => {
                  res.onAborted(() => (res.isAborted = true));
                  await mod[key](res, req);
                });

                break;

              case "get":
                server.get(route, async (res: HttpResponse, req: HttpRequest) => {
                  res.onAborted(() => (res.isAborted = true));
                  mod[key](res, req);
                });

                break;

              case "head":
                server.head(route, async (res: HttpResponse, req: HttpRequest) => {
                  res.onAborted(() => (res.isAborted = true));
                  await mod[key](res, req);
                });

                break;

              case "options":
                server.options(route, async (res: HttpResponse, req: HttpRequest) => {
                  res.onAborted(() => (res.isAborted = true));
                  await mod[key](res, req);
                });

                break;

              case "patch":
                server.patch(route, async (res: HttpResponse, req: HttpRequest) => {
                  res.onAborted(() => (res.isAborted = true));
                  await mod[key](res, req);
                });

                break;

              case "post":
                server.post(route, async (res: HttpResponse, req: HttpRequest) => {
                  res.onAborted(() => (res.isAborted = true));
                  await mod[key](res, req);
                });

                break;

              case "put":
                server.put(route, async (res: HttpResponse, req: HttpRequest) => {
                  res.onAborted(() => (res.isAborted = true));
                  await mod[key](res, req);
                });

                break;

              case "trace":
                server.trace(route, async (res: HttpResponse, req: HttpRequest) => {
                  res.onAborted(() => (res.isAborted = true));
                  await mod[key](res, req);
                });

                break;
            }
          }
        }
      }),
    ]);
  } catch (err) {
    logger.error(err.message);
  }

  return server;
}

export default await getServer();
