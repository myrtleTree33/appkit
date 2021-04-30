import type { HttpRequest, HttpResponse } from "uWebSockets.js";
import { config } from "..";

export const srcRoutes = `${process.cwd()}/${config.nodeEnv === "development" ? "src" : "dist"}/routes`;

export async function useMiddleware(
  res: HttpResponse,
  req: HttpRequest,
  middleware: Array<(res: HttpResponse, req: HttpRequest) => Promise<void>>
): Promise<void> {
  for (let i = 0; i < middleware.length; i++) {
    if (res.isAborted) {
      break;
    }

    await middleware[i](res, req);
  }
}

export function getRouteFromFilename(fn: string): string {
  // eslint-disable-next-line
  const segments = fn.replace(`${srcRoutes}/`, "").split("/");

  return "/";
}
