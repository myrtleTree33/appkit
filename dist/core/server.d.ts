import type { HttpRequest, HttpResponse, RecognizedString, TemplatedApp, us_listen_socket } from "uWebSockets.js";
declare module "uWebSockets.js" {
    interface HttpResponse {
        isAborted: boolean;
        json: (obj: any, status?: string | number) => void;
    }
    interface HttpRequest {
        ctx: {
            [key: string]: any;
        };
    }
    interface TemplatedApp {
        [key: string]: (pattern: RecognizedString, handler: Handler) => TemplatedApp;
    }
}
export type { HttpRequest, HttpResponse } from "uWebSockets.js";
export declare type Handler = (res: HttpResponse, req: HttpRequest) => void;
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
    listen(host: RecognizedString, port: number, cb: (listenSocket: us_listen_socket) => void): Promise<TemplatedApp>;
}
export declare function getServer(): Promise<Server>;
