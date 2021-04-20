import uWebSockets, {
  HttpRequest,
  HttpResponse,
  RecognizedString,
  TemplatedApp,
  WebSocketBehavior,
  us_listen_socket,
} from "uWebSockets.js";
import { createServer as createViteServer } from "vite";
import type { ViteDevServer } from "vite";
import config from "./config";
import { IncomingMessage, ServerResponse } from "node:http";
import { Socket } from "node:net";

const { App, us_listen_socket_close } = uWebSockets;

export class Server {
  #listenSocket: us_listen_socket | null;
  #server: TemplatedApp;
  #viteServer?: ViteDevServer;

  constructor() {
    this.#listenSocket = null;
    this.#server = App({});
  }

  public get listenSocket(): us_listen_socket | null {
    return this.#listenSocket;
  }

  public set listenSocket(_listenSocket: us_listen_socket | null) {
    this.#listenSocket = _listenSocket;
  }

  async createViteServer() {
    this.#viteServer = await createViteServer({
      server: { middlewareMode: true },
    });
  }

  initFileBasedRouter() {
    // this.#server.any("/*", (res: HttpResponse, req: HttpRequest) => {
    //   if (config.nodeEnv === "development") {
    //     // TODO: Convert HttpRequest to IncomingMessage and HttpResponse to ServerResponse.
    //     const newReq = new IncomingMessage(new Socket());
    //     const newRes = new ServerResponse(newReq);
    //     this.#viteServer?.middlewares(newReq, newRes, async () => {});
    //   }
    // });
  }

  any(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.any(pattern, handler);
  }

  close() {
    if (!this.#listenSocket) return;
    us_listen_socket_close(this.#listenSocket);
    this.#listenSocket = null;
  }

  connect(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.connect(pattern, handler);
  }

  del(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.del(pattern, handler);
  }

  get(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.get(pattern, handler);
  }

  head(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.head(pattern, handler);
  }

  listen(
    host: RecognizedString,
    port: number,
    cb: (listenSocket: us_listen_socket) => void
  ): TemplatedApp {
    return this.#server.listen(host, port, cb);
  }

  numSubscribers(topic: RecognizedString): number {
    return this.#server.numSubscribers(topic);
  }

  options(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.options(pattern, handler);
  }

  patch(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.patch(pattern, handler);
  }

  post(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.post(pattern, handler);
  }

  publish(
    topic: RecognizedString,
    message: RecognizedString,
    isBinary?: boolean,
    compress?: boolean
  ): boolean {
    return this.#server.publish(topic, message, isBinary, compress);
  }

  put(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.put(pattern, handler);
  }

  trace(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.trace(pattern, handler);
  }

  ws(pattern: RecognizedString, behavior: WebSocketBehavior): TemplatedApp {
    return this.#server.ws(pattern, behavior);
  }
}

async function getServer(): Promise<Server> {
  const server = new Server();

  if (config.nodeEnv === "development") {
    await server.createViteServer();
  }

  server.initFileBasedRouter();
  return server;
}

export default await getServer();
