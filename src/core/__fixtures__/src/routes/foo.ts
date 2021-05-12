import { setTimeout } from "timers/promises";
// eslint-disable-next-line
// @ts-ignore
import type { HttpRequest, HttpResponse } from "../../../../../../../server";

export const post = async (req: HttpRequest, res: HttpResponse): Promise<void> => {
  const foo = await setTimeout(10, "bar");

  return res.json({
    source: "ts",
    foo,
  });
};
