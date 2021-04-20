import uWebSockets from "uWebSockets.js";
import { createServer as createViteServer } from "vite";
import config from "./config";
const { App, us_listen_socket_close } = uWebSockets;
export class Server {
    constructor() {
        this.#listenSocket = null;
        this.#server = App({});
    }
    #listenSocket;
    #server;
    #viteServer;
    get listenSocket() {
        return this.#listenSocket;
    }
    set listenSocket(_listenSocket) {
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
    any(pattern, handler) {
        return this.#server.any(pattern, handler);
    }
    close() {
        this.#viteServer?.close();
        if (!this.#listenSocket)
            return;
        us_listen_socket_close(this.#listenSocket);
        this.#listenSocket = null;
    }
    connect(pattern, handler) {
        return this.#server.connect(pattern, handler);
    }
    del(pattern, handler) {
        return this.#server.del(pattern, handler);
    }
    get(pattern, handler) {
        return this.#server.get(pattern, handler);
    }
    head(pattern, handler) {
        return this.#server.head(pattern, handler);
    }
    async listen(host, port, cb) {
        if (config.nodeEnv === "development") {
            await this.createViteServer();
        }
        return this.#server.listen(host, port, cb);
    }
    numSubscribers(topic) {
        return this.#server.numSubscribers(topic);
    }
    options(pattern, handler) {
        return this.#server.options(pattern, handler);
    }
    patch(pattern, handler) {
        return this.#server.patch(pattern, handler);
    }
    post(pattern, handler) {
        return this.#server.post(pattern, handler);
    }
    publish(topic, message, isBinary, compress) {
        return this.#server.publish(topic, message, isBinary, compress);
    }
    put(pattern, handler) {
        return this.#server.put(pattern, handler);
    }
    trace(pattern, handler) {
        return this.#server.trace(pattern, handler);
    }
    ws(pattern, behavior) {
        return this.#server.ws(pattern, behavior);
    }
}
async function getServer() {
    const server = new Server();
    server.initFileBasedRouter();
    return server;
}
export default await getServer();
