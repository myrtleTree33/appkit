import type { HttpRequest, HttpResponse } from "uWebSockets.js";
export declare const useMiddleware: (res: HttpResponse, req: HttpRequest, middleware: ((res: HttpResponse, req: HttpRequest) => Promise<void>)[]) => Promise<void>;
