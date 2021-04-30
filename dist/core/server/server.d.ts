import type { HttpRequest, HttpResponse, RecognizedString, TemplatedApp, WebSocketBehavior, us_listen_socket } from "uWebSockets.js";
declare module "uWebSockets.js" {
    interface HttpResponse {
        isAborted: boolean;
    }
}
export type { HttpRequest, HttpResponse } from "uWebSockets.js";
export declare type Handler = (res: HttpResponse, req: HttpRequest) => Promise<void>;
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
    get listenSocket(): us_listen_socket | null;
    set listenSocket(_listenSocket: us_listen_socket | null);
    any(pattern: RecognizedString, handler: Handler): TemplatedApp;
    connect(pattern: RecognizedString, handler: Handler): TemplatedApp;
    del(pattern: RecognizedString, handler: Handler): TemplatedApp;
    get(pattern: RecognizedString, handler: Handler): TemplatedApp;
    head(pattern: RecognizedString, handler: Handler): TemplatedApp;
    options(pattern: RecognizedString, handler: Handler): TemplatedApp;
    patch(pattern: RecognizedString, handler: Handler): TemplatedApp;
    post(pattern: RecognizedString, handler: Handler): TemplatedApp;
    put(pattern: RecognizedString, handler: Handler): TemplatedApp;
    trace(pattern: RecognizedString, handler: Handler): TemplatedApp;
    close(): Promise<void>;
    listen(host: RecognizedString, port: number, cb: (listenSocket: us_listen_socket) => void): Promise<TemplatedApp>;
    numSubscribers(topic: RecognizedString): number;
    publish(topic: RecognizedString, message: RecognizedString, isBinary?: boolean, compress?: boolean): boolean;
    ws(pattern: RecognizedString, behavior: WebSocketBehavior): TemplatedApp;
}
declare const _default: Server;
export default _default;
