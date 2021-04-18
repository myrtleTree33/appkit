import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli.command("worker", "Start the background worker.").action(() => {});
};
