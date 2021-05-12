import { setTimeout } from "timers/promises";

export const post = async (req, res) => {
  return res.cookie("foo", "bar", { maxAge: 1000, signed: true }).json({
    source: "js",
    foo: await setTimeout(10, "bar"),
  });
};
