import { setTimeout } from "timers/promises";

export const post = async (req, res) => {
  return res.json({
    source: "js",
    foo: await setTimeout(10, "bar"),
  });
};
