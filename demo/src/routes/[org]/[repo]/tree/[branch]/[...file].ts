import type { HttpRequest, HttpResponse } from "@appist/appkit";

export const get = async (req: HttpRequest, res: HttpResponse): Promise<void> => {
  res.json({ data: req.params });
};
