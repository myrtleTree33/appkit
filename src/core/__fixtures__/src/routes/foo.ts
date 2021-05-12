import { setTimeout } from "timers/promises";
import type { HttpRequest, HttpResponse } from "../../../../../dist";

export const post = async (req: HttpRequest, res: HttpResponse): Promise<void> => {
  return res.json({
    source: "ts",
    foo: await setTimeout(10, "bar"),
  });
};
