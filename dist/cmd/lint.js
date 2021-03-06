import { execSync } from "child_process";
import { cmd } from "..";
cmd
    .command("lint", "Lint/Format the code with ESLint and Prettier. (only for NODE_ENV=development)")
    .option("--fix", "Fix the errors/warnings emitted by ESLint/Prettier.")
    .action(async (opts) => {
    if (opts.fix) {
        execSync("npm exec prettier -- --write .", { stdio: "inherit" });
        execSync("npm exec eslint -- --fix .", { stdio: "inherit" });
        return;
    }
    execSync("npm exec prettier -- --check .", { stdio: "inherit" });
    execSync("npm exec eslint -- .", { stdio: "inherit" });
});
