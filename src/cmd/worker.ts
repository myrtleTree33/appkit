import type { Cmd } from "./cmd";

export default (cmd: Cmd): void => {
  cmd.command("worker", "Start the background worker.").action(() => {});
};
