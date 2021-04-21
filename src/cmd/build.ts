import type { Cmd } from "./cmd";

export default (cli: Cmd): void => {
  cli.command("build", "Build the application for production deployment.").action(() => {});
};
