import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli
    .command("dev", "Start the server/worker in development mode.", { default: true })
    .example("dev")
    .action(() => {});
};
