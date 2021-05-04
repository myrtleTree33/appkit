import type { HttpRequest, HttpResponse } from "uWebSockets.js";
import { getConfig } from "./config";

const config = getConfig();

export type Middleware = (req: HttpRequest, res: HttpResponse) => Promise<boolean>;

export async function useMiddleware(req: HttpRequest, res: HttpResponse, middleware: Array<Middleware>): Promise<void> {
  for (let i = 0; i < middleware.length; i++) {
    if (res.isAborted || !(await middleware[i](req, res))) break;
  }
}

export function getRouteFromFilename(fn: string): string {
  // eslint-disable-next-line
  const segments = fn.replace(`${process.cwd()}/${config.routesPath}/`, "").split("/");

  return "/";
}
