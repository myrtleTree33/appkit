import { execSync } from "child_process";
import { cmd } from "..";

cmd.command("lint:staged", "Run linters against staged git files.").action(async () => {
  execSync("npm exec lint-staged", { stdio: "inherit" });
});
