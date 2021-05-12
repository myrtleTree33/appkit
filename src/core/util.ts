import { extname } from "path";
import type { HttpRequest, HttpResponse } from "uWebSockets.js";
import { getConfig } from "./config";

const config = getConfig();

export const SUPPORTED_EXTS = [".js", ".svelte", ".ts"];

export type Middleware = (req: HttpRequest, res: HttpResponse) => Promise<boolean>;

export async function useMiddleware(
  req: HttpRequest,
  res: HttpResponse,
  middleware: Array<Middleware>
): Promise<void> {
  for (let i = 0; i < middleware.length; i++) {
    if (res.isAborted || !(await middleware[i](req, res))) break;
  }
}

export function getRouterPathFromFilename(fn: string): string {
  if (SUPPORTED_EXTS.indexOf(extname(fn)) < 0) return "";

  // eslint-disable-next-line
  const segments = fn
    .replace(`${config.routesPath}/`, "")
    .replace(/\.(js|svelte|ts)/, "")
    .split("/");
  if (segments.length === 1 && segments[0].startsWith("index")) return "/";

  let route = "/";
  for (let i = 0; i < segments.length; i++) {
    if (i === segments.length - 1 && segments[i].startsWith("index")) break;
    if (!route.endsWith("/")) route += "/";

    if (/\[(\.\.\.)([0-9a-zA-Z]*)\]/.test(segments[i])) {
      route += `${segments[i].replace(/\[\.\.\.([0-9a-zA-Z]*)\]/g, ":$1*")}`;
    } else {
      route += `${segments[i].replace(/\[([0-9a-zA-Z]*)\]/g, ":$1")}`;
    }
  }

  return route;
}
