import dockerCompose from "docker-compose";

import { default as cmd } from "./cmd";

cmd.command("teardown", "Destroy the `docker-compose` cluster.").action(async () => {
  try {
    await dockerCompose.down({
      cwd: process.cwd(),
      log: true,
      commandOptions: ["--remove-orphans"],
    });
  } catch (err) {
    process.exit(1);
  }
});
