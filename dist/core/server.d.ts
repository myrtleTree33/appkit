import type { CookieSerializeOptions } from "cookie";
import type { HttpRequest, HttpResponse, TemplatedApp } from "uWebSockets.js";
declare module "cookie" {
    interface CookieSerializeOptions {
        /**
         * Indicates if the cookie should be signed.
         */
        signed?: boolean;
    }
}
declare module "uWebSockets.js" {
    interface HttpResponse {
        /**
         * Indicates if a response is aborted for skipping the response sending.
         */
        isAborted: boolean;
        /**
         * Sets cookie `name` to `value`. The value parameter may be a string or object converted to JSON.
         */
        cookie: (name: string, value: string | unknown, opts: CookieSerializeOptions) => HttpResponse;
        /**
         * Sends a JSON response.
         */
        json: (obj: unknown, status?: number) => void;
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
         * Contains key-value pairs in the request headers. Note that the key must be lower case. By
         * default, it is {}.
         */
        headers: {
            [key: string]: string;
        };
        /**
         * Contains a string corresponding to the HTTP method of the request: GET, POST, PUT, and so
         * on.
         */
        method: string;
        /**
         * Contains key-value pairs mapped to the route's named parameters. For example, if the route
         * is "/user/:name", then the "name" property is available as req.params.name. By default, it
         * is {}.
         */
        params: {
            [key: string]: string;
        };
        /**
         * Contains the path part of the request URL. For example, if the request URL is
         * http://api.dev/user, then the path will be "/user".
         */
        path: string;
        /**
         * Contains key-value pairs mapped to the route's query string parameters. For example, if the
         * query string is "/shoes?order=desc&shoe[color]=blue&shoe[type]=converse", then "req.query"
         * will be { "shoe": { "color": "blue", "type": "converse" } }.
         */
        query: {
            [key: string]: unknown;
        };
    }
    interface TemplatedApp {
        [key: string]: (pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void) => TemplatedApp;
    }
}
declare type Handler = (req: HttpRequest, res: HttpResponse) => Promise<void>;
export type { CookieSerializeOptions } from "cookie";
export type { HttpRequest, HttpResponse } from "uWebSockets.js";
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
    get routes(): Routes;
    address(): string;
    close(): Promise<void>;
    init(): Promise<void>;
    initRoutes(): Promise<void>;
    initViteDevServer(): Promise<void>;
    listen(cb?: () => void): TemplatedApp;
}
export declare function getServer(): Promise<Server>;
