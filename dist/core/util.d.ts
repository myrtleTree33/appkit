import type { HttpRequest, HttpResponse } from "uWebSockets.js";
export declare const SUPPORTED_EXTS: string[];
export declare type Middleware = (req: HttpRequest, res: HttpResponse) => Promise<boolean>;
export declare function useMiddleware(req: HttpRequest, res: HttpResponse, middleware: Array<Middleware>): Promise<void>;
export declare function getRouterPathFromFilename(fn: string): string;
