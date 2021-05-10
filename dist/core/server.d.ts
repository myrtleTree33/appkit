import type { HttpRequest, HttpResponse, RecognizedString, TemplatedApp, us_listen_socket } from "uWebSockets.js";
declare module "uWebSockets.js" {
    interface HttpResponse {
        isAborted: boolean;
        json: (obj: unknown, status?: string | number) => void;
    }
    interface HttpRequest {
        /**
         * Contains key-value pairs in the request cookies. By default, it is {}.
         */
        cookies: {
            [key: string]: string;
        };
        /**
         * Contains key-value pairs in the request cookies that are signed. By default, it is {}.
         */
        signedCookies: {
            [key: string]: string;
        };
        ctx: {
            [key: string]: unknown;
        };
        /**
         * Contains key-value pairs in the request headers. Note that the key must be lower case. By default, it is {}.
         */
        headers: {
            [key: string]: string;
        };
        /**
         * Contains a string corresponding to the HTTP method of the request: GET, POST, PUT, and so on.
         */
        method: string;
        /**
         * Contains key-value pairs mapped to the route's named parameters. For example, if the route is "/user/:name",
         * then the "name" property is available as req.params.name. By default, it is {}.
         */
        params: {
            [key: string]: string;
        };
        /**
         * Contains the path part of the request URL. For example, if the request URL is http://api.dev/user, then the
         * path will be "/user".
         */
        path: string;
        /**
         * Contains key-value pairs mapped to the route's query string parameters. For example, if the query string is
         * "/shoes?order=desc&shoe[color]=blue&shoe[type]=converse", then "req.query" will be
         * { "shoe": { "color": "blue", "type": "converse" } }.
         */
        query: {
            [key: string]: unknown;
        };
    }
    interface TemplatedApp {
        [key: string]: (pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void) => TemplatedApp;
    }
}
export type { HttpRequest, HttpResponse } from "uWebSockets.js";
export declare type Handler = (req: HttpRequest, res: HttpResponse) => Promise<void>;
export declare type Routes = {
    [key: string]: Route;
};
export interface Route {
    method: string;
    path: string;
    handler: Handler;
}
export declare class Server {
    #private;
    constructor();
    get listenSocket(): us_listen_socket | null;
    set listenSocket(_listenSocket: us_listen_socket | null);
    get routes(): Routes;
    address(): string;
    close(): Promise<void>;
    init(): Promise<void>;
    initRoutes(): Promise<void>;
    initViteDevServer(): Promise<void>;
    listen(host: RecognizedString, port: number, cb?: () => void): TemplatedApp;
}
export declare function getServer(): Promise<Server>;
