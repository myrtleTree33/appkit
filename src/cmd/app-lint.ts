import { execSync } from "child_process";
import { default as cmd } from "./cmd";

cmd
  .command("app:lint", "Lint/Format the code with ESLint and Prettier.")
  .option("--fix", "Fix the errors/warnings emitted by ESLint/Prettier.")
  .action(async (opts) => {
    if (opts.fix) {
      execSync("npm exec prettier -- --write .", { stdio: "inherit" });
      execSync("npm exec eslint -- --fix --ignore-path .gitignore .", { stdio: "inherit" });
      return;
    }

    execSync("npm exec prettier -- --check .", { stdio: "inherit" });
    execSync("npm exec eslint -- --ignore-path .gitignore .", { stdio: "inherit" });
  });
