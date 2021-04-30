import type { HttpRequest, HttpResponse } from "uWebSockets.js";
export declare const srcRoutes: string;
export declare function useMiddleware(res: HttpResponse, req: HttpRequest, middleware: Array<(res: HttpResponse, req: HttpRequest) => Promise<void>>): Promise<void>;
export declare function getRouteFromFilename(fn: string): string;
