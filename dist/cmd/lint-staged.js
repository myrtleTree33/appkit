import { execSync } from "child_process";
import { default as cmd } from "./cmd";
cmd.command("lint:staged", "Run linters against staged git files.").action(async () => {
    execSync("npm exec lint-staged", { stdio: "inherit" });
});
