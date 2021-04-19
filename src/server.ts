import uWebSockets, {
  HttpRequest,
  HttpResponse,
  RecognizedString,
  TemplatedApp,
  WebSocketBehavior,
  us_listen_socket,
} from "uWebSockets.js";

const { App } = uWebSockets;

export class Server {
  #server: TemplatedApp;

  constructor() {
    this.#server = App({});
  }

  any(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void
  ): TemplatedApp {
    return this.#server.any(pattern, handler);
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

function getServer(): Server {
  return new Server();
}

export default getServer();
