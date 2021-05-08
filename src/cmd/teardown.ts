import { execSync } from "child_process";
import { cmd } from "..";

cmd.command("teardown", "Destroy the `docker-compose` cluster. (only for NODE_ENV=development)").action(async () => {
  try {
    execSync("docker compose down --remove-orphans", { stdio: "inherit" });
  } catch (err) {
    process.exit(1);
  }
});
