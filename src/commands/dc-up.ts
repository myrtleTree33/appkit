import dockerCompose from "docker-compose";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli.command("dc:up", "Setup the `docker-compose` cluster.").action(async (opts) => {
    try {
      await dockerCompose.upAll({ cwd: process.cwd(), log: true });
    } catch (err) {
      process.exit(1);
    } finally {
    }
  });
};
