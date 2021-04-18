import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli.command("server", "Start the HTTP server.").action(() => {});
};
