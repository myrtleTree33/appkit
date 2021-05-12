import type { HttpRequest, HttpResponse } from "../../../dist";

export const get = async (req: HttpRequest, res: HttpResponse): Promise<void> => {
  res.json({ error: "keke" });
};
