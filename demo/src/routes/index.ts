import type { HttpRequest, HttpResponse } from "@appist/appkit";
// import { useMiddleware } from "@appist/appkit";
// import fetch from "node-fetch";

export const get = async (req: HttpRequest, res: HttpResponse): Promise<void> => {
  // await useMiddleware(req, res, [
  //   async (req: HttpRequest, res: HttpResponse): Promise<boolean> => {
  //     req.ctx = { data: [] };
  //     const r = await fetch("https://jsonplaceholder.typicode.com/todos/2");
  //     req.ctx.data.push(await r.json());

  //     return false;
  //   },
  // ]);

  res.json({ data: req.ctx?.data, error: "keke" });
};
