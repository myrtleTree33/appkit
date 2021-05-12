import type { HttpRequest, HttpResponse } from "../../../../../../../dist";

export const get = async (req: HttpRequest, res: HttpResponse): Promise<void> => {
  return res.json({
    cookies: req.cookies,
    signedCookies: req.signedCookies,
    headers: req.headers,
    query: req.query,
    params: req.params,
  });
};
