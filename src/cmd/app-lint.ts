import { execSync } from "child_process";
import { default as cmd } from "./cmd";

cmd
  .command("app:lint", "Lint/Format the code with ESLint and Prettier.")
  .option("--fix", "Fix the errors/warnings emitted by ESLint/Prettier.")
  .option("--staged", "Run linters against staged git files.")
  .action(async (opts) => {
    if (opts.fix) {
      execSync("npm exec prettier -- --write .", { stdio: "inherit" });
      execSync("npm exec eslint -- --fix .", { stdio: "inherit" });
      return;
    }

    if (opts.staged) {
      execSync("npm exec lint-staged", { stdio: "inherit" });
      return;
    }

    execSync("npm exec prettier -- --check .", { stdio: "inherit" });
    execSync("npm exec eslint -- .", { stdio: "inherit" });
  });
