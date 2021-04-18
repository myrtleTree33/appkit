import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli.command("build", "Build the application for production deployment.").action(() => {});
};
