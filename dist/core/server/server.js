import tinyGlob from "tiny-glob";
import { config, logger } from "..";
import uWebSockets from "uWebSockets.js";
import { getRouteFromFilename, srcRoutes } from "./util";
const { App, us_listen_socket_close } = uWebSockets;
export class Server {
    constructor() {
        this.#listenSocket = null;
        this.#server = App({});
        this.#vite = null;
        this.#routes = {};
    }
    #listenSocket;
    #server;
    #vite;
    #routes;
    get routes() {
        return this.#routes;
    }
    get listenSocket() {
        return this.#listenSocket;
    }
    set listenSocket(_listenSocket) {
        this.#listenSocket = _listenSocket;
    }
    any(pattern, handler) {
        return this.#server.any(pattern, handler);
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
    options(pattern, handler) {
        return this.#server.options(pattern, handler);
    }
    patch(pattern, handler) {
        return this.#server.patch(pattern, handler);
    }
    post(pattern, handler) {
        return this.#server.post(pattern, handler);
    }
    put(pattern, handler) {
        return this.#server.put(pattern, handler);
    }
    trace(pattern, handler) {
        return this.#server.trace(pattern, handler);
    }
    async close() {
        if (!this.#listenSocket)
            return;
        us_listen_socket_close(this.#listenSocket);
        this.#listenSocket = null;
        if (this.#vite?.httpServer?.listening)
            await this.#vite.close();
    }
    async listen(host, port, cb) {
        return this.#server.listen(host, port, cb);
    }
    numSubscribers(topic) {
        return this.#server.numSubscribers(topic);
    }
    publish(topic, message, isBinary, compress) {
        return this.#server.publish(topic, message, isBinary, compress);
    }
    ws(pattern, behavior) {
        return this.#server.ws(pattern, behavior);
    }
}
async function getServer() {
    const server = new Server();
    try {
        const files = await tinyGlob(`${srcRoutes}/**/!(*.spec|*.test).${config.nodeEnv === "development" ? "{md,mdx,ts,svelte}" : "{js}"}`, {
            absolute: true,
            filesOnly: true,
        });
        await Promise.all([
            files.map(async (fn) => {
                if (fn.endsWith(config.nodeEnv === "development" ? ".ts" : ".js")) {
                    const mod = await import(fn);
                    const route = getRouteFromFilename(fn);
                    for (const key of Object.keys(mod)) {
                        if (typeof mod[key] !== "function")
                            continue;
                        switch (key) {
                            case "connect":
                                server.connect(route, async (res, req) => {
                                    res.onAborted(() => (res.isAborted = true));
                                    await mod[key](res, req);
                                });
                                break;
                            case "del":
                                server.del(route, async (res, req) => {
                                    res.onAborted(() => (res.isAborted = true));
                                    await mod[key](res, req);
                                });
                                break;
                            case "get":
                                server.get(route, async (res, req) => {
                                    res.onAborted(() => (res.isAborted = true));
                                    mod[key](res, req);
                                });
                                break;
                            case "head":
                                server.head(route, async (res, req) => {
                                    res.onAborted(() => (res.isAborted = true));
                                    await mod[key](res, req);
                                });
                                break;
                            case "options":
                                server.options(route, async (res, req) => {
                                    res.onAborted(() => (res.isAborted = true));
                                    await mod[key](res, req);
                                });
                                break;
                            case "patch":
                                server.patch(route, async (res, req) => {
                                    res.onAborted(() => (res.isAborted = true));
                                    await mod[key](res, req);
                                });
                                break;
                            case "post":
                                server.post(route, async (res, req) => {
                                    res.onAborted(() => (res.isAborted = true));
                                    await mod[key](res, req);
                                });
                                break;
                            case "put":
                                server.put(route, async (res, req) => {
                                    res.onAborted(() => (res.isAborted = true));
                                    await mod[key](res, req);
                                });
                                break;
                            case "trace":
                                server.trace(route, async (res, req) => {
                                    res.onAborted(() => (res.isAborted = true));
                                    await mod[key](res, req);
                                });
                                break;
                        }
                    }
                }
            }),
        ]);
    }
    catch (err) {
        logger.error(err.message);
    }
    return server;
}
export default await getServer();
