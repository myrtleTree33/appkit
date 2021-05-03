import { execSync } from "child_process";
import { cmd } from "..";
cmd.command("teardown", "Destroy the `docker-compose` cluster.").action(async () => {
    try {
        execSync("docker compose down --remove-orphans", { stdio: "inherit" });
    }
    catch (err) {
        process.exit(1);
    }
});
