import tinyGlob from "tiny-glob";
import uWebSockets from "uWebSockets.js";
import { default as logger } from "./logger";
const { App, us_listen_socket_close } = uWebSockets;
export class Server {
    constructor() {
        this.#listenSocket = null;
        this.#server = App({});
    }
    #listenSocket;
    #server;
    get listenSocket() {
        return this.#listenSocket;
    }
    set listenSocket(_listenSocket) {
        this.#listenSocket = _listenSocket;
    }
    any(pattern, handler) {
        return this.#server.any(pattern, handler);
    }
    close() {
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
    try {
        const files = await tinyGlob(`${process.cwd()}/src/routes/**/*.{ts}`);
        await Promise.all(files.map(async (f) => {
            await import(`${process.cwd()}/${f}`);
        }));
    }
    catch (err) {
        logger.warn(err.message);
    }
    return server;
}
export default await getServer();