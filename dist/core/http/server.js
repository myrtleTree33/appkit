import tinyGlob from "tiny-glob";
import { createServer } from "vite";
import uWebSockets from "uWebSockets.js";
const { App, us_listen_socket_close } = uWebSockets;
import { config, logger } from "../..";
import { getRouteFromFilename, srcRoutes } from "./util";
export class Server {
    constructor() {
        this.#listenSocket = null;
        this.#server = App();
        this.#vite = null;
        this.#routes = {};
        this.#timestamp = "";
    }
    #timestamp;
    #listenSocket;
    #server;
    #vite;
    #routes;
    get listenSocket() {
        return this.#listenSocket;
    }
    set listenSocket(_listenSocket) {
        this.#listenSocket = _listenSocket;
    }
    get routes() {
        return this.#routes;
    }
    async close() {
        if (!this.#listenSocket)
            return;
        us_listen_socket_close(this.#listenSocket);
        this.#listenSocket = null;
        await this.#vite?.close();
    }
    async init() {
        await this.initRoutes();
        await this.initViteDevServer();
    }
    async initRoutes() {
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
                            if (typeof mod[key] !== "function" ||
                                ["any", "connect", "del", "get", "head", "options", "patch", "post", "put", "trace"].indexOf(key) < 0) {
                                continue;
                            }
                            this.#server[key](route, (res, req) => {
                                // Setup HttpRequest helpers.
                                req.ctx = {};
                                // Setup HttpResponse helpers.
                                res.isAborted = false;
                                res.onAborted(() => (res.isAborted = true));
                                res.isRendered = false;
                                res.__proto__.json = function (obj, status = "200") {
                                    if (this.isAborted)
                                        return;
                                    res
                                        .writeStatus(status.toString())
                                        .writeHeader("Content-Type", "application/json")
                                        .end(JSON.stringify(obj));
                                    res.isRendered = true;
                                };
                                if (mod[key].constructor.name === "AsyncFunction") {
                                    mod[key](req, res).catch((err) => logger.error(err));
                                    return;
                                }
                                mod[key](req, res);
                            });
                        }
                    }
                }),
            ]);
        }
        catch (err) {
            logger.error(err);
        }
    }
    async initViteDevServer() {
        this.#vite = await createServer();
    }
    async listen(host, port, cb) {
        return this.#server.listen(host, port, cb);
    }
}
export async function getServer() {
    const server = new Server();
    await server.init();
    return server;
}
