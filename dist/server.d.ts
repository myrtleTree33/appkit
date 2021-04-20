import { HttpRequest, HttpResponse, RecognizedString, TemplatedApp, WebSocketBehavior, us_listen_socket } from "uWebSockets.js";
export declare class Server {
    #private;
    constructor();
    get listenSocket(): us_listen_socket | null;
    set listenSocket(_listenSocket: us_listen_socket | null);
    createViteServer(): Promise<void>;
    initFileBasedRouter(): void;
    any(pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void): TemplatedApp;
    close(): void;
    connect(pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void): TemplatedApp;
    del(pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void): TemplatedApp;
    get(pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void): TemplatedApp;
    head(pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void): TemplatedApp;
    listen(host: RecognizedString, port: number, cb: (listenSocket: us_listen_socket) => void): Promise<TemplatedApp>;
    numSubscribers(topic: RecognizedString): number;
    options(pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void): TemplatedApp;
    patch(pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void): TemplatedApp;
    post(pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void): TemplatedApp;
    publish(topic: RecognizedString, message: RecognizedString, isBinary?: boolean, compress?: boolean): boolean;
    put(pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void): TemplatedApp;
    trace(pattern: RecognizedString, handler: (res: HttpResponse, req: HttpRequest) => void): TemplatedApp;
    ws(pattern: RecognizedString, behavior: WebSocketBehavior): TemplatedApp;
}
declare const _default: Server;
export default _default;
