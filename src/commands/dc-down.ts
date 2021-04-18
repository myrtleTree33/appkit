import dockerCompose from "docker-compose";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli.command("dc:down", "Destroy the `docker-compose` cluster.").action(async (opts) => {
    try {
      await dockerCompose.down({
        cwd: process.cwd(),
        log: true,
        commandOptions: ["--remove-orphans"],
      });
    } catch (err) {
      process.exit(1);
    } finally {
    }
  });
};
