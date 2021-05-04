import type { HttpRequest, HttpResponse } from "uWebSockets.js";
export declare type Middleware = (req: HttpRequest, res: HttpResponse) => Promise<boolean>;
export declare function useMiddleware(req: HttpRequest, res: HttpResponse, middleware: Array<Middleware>): Promise<void>;
export declare function getRouteFromFilename(fn: string): string;
