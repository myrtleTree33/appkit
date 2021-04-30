import type { HttpRequest, HttpResponse } from "uWebSockets.js";

export const useMiddleware = async (
  res: HttpResponse,
  req: HttpRequest,
  middleware: Array<(res: HttpResponse, req: HttpRequest) => Promise<void>>
): Promise<void> => {
  res.onAborted(() => {
    res.isAborted = true;
  });

  for (let i = 0; i < middleware.length; i++) {
    if (res.isAborted) {
      break;
    }

    await middleware[i](res, req);
  }
};
