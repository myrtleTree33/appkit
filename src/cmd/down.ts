import dockerCompose from "docker-compose";

import type { Cmd } from "./cmd";

export default (cmd: Cmd): void => {
  cmd.command("down", "Destroy the `docker-compose` cluster.").action(async (opts) => {
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
