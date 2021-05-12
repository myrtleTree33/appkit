import Router from "@koa/router";
import qs from "qs";
import cookieParser from "cookie-parser";
import tinyGlob from "tiny-glob";
import uWebSockets from "uWebSockets.js";
import { createServer } from "vite";
const { App, us_listen_socket_close } = uWebSockets;
import { config, logger } from "../globals";
import { getRouterPathFromFilename } from "./util";
export class Server {
    constructor() {
        this.#listenSocket = null;
        this.#server = App();
        this.#vite = null;
        this.#router = new Router();
        this.#routes = {};
    }
    #listenSocket;
    #server;
    #vite;
    #router;
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
    address() {
        return `${config.host}:${config.port}`;
    }
    async close() {
        await this.#vite?.close();
        if (!this.#listenSocket)
            return;
        us_listen_socket_close(this.#listenSocket);
        this.#listenSocket = null;
    }
    async init() {
        await this.initRoutes();
        await this.initViteDevServer();
    }
    async initRoutes() {
        try {
            const files = await tinyGlob(`${config.routesPath}/**/!(*.spec|*.test).${config.nodeEnv === "development" ? "{md,mdx,ts,svelte}" : "{js}"}`, {
                absolute: true,
                filesOnly: true,
            });
            await Promise.all([
                files.map(async (fn) => {
                    if (fn.endsWith(config.nodeEnv === "development" ? ".ts" : ".js")) {
                        const mod = await import(fn);
                        const path = getRouterPathFromFilename(fn);
                        for (const method of Object.keys(mod)) {
                            if (typeof mod[method] !== "function" ||
                                ["any", "connect", "del", "get", "head", "options", "patch", "post", "put", "trace"].indexOf(method) < 0) {
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
                                // Don't need to anything as we are only using the route matching due to the route matching from
                                // uWebSockets.js doesn't meet our need.
                            });
                        }
                    }
                }),
            ]);
            // Use @koa/router to better handle the route matching.
            this.#server.any("/*", (res, req) => {
                const match = this.#router.match(req.getUrl(), req.getMethod());
                if (!match || !match.path || match.path.length < 1) {
                    return res.writeStatus("404").end("");
                }
                const route = this.#routes[`${req.getMethod()} ${match.path[0].path}`];
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
                    req, res, () => {
                        // Not doing anything as we only need to set req.cookies and req.signedCookies.
                    });
                }
                // Set the request method.
                req.method = req.getMethod();
                // Set the request path.
                req.path = req.getUrl();
                // Set the request params.
                const params = match.path[0]?.captures(req.getUrl());
                req.getParameter = function (index) {
                    return index < params.length ? params[index] : "";
                };
                req.params = match.path[0].params(req.getUrl(), params) || {};
                // Set the request query string params.
                req.query = qs.parse(req.getQuery());
                // Setup HttpResponse helpers.
                res.isAborted = false;
                res.onAborted(() => (res.isAborted = true));
                res.__proto__.json = function (obj, status = "200") {
                    if (this.isAborted)
                        return;
                    this.cork(() => {
                        this.writeStatus(status.toString())
                            .writeHeader("Content-Type", "application/json")
                            .end(JSON.stringify(obj));
                    });
                };
                if (route.handler.constructor.name === "AsyncFunction") {
                    return route.handler(req, res).catch((err) => logger.error(err));
                }
                return route.handler(req, res);
            });
        }
        catch (err) {
            if (config.nodeEnv === "test")
                return;
            logger.error(err);
        }
    }
    async initViteDevServer() {
        this.#vite = await createServer();
    }
    listen(cb) {
        this.#server.listen(config.host, config.port, (socket) => {
            if (socket) {
                this.#listenSocket = socket;
                logger.info(`Server is listening on http://${config.host}:${config.port}...`);
            }
            if (cb)
                cb();
        });
        return this.#server;
    }
}
export async function getServer() {
    const server = new Server();
    await server.init();
    return server;
}
