import { series } from "async";
import { exec } from "child_process";
import { default as cmd } from "./cmd";

cmd
  .command("app:lint", "Lint/Format the code with ESLint and Prettier.")
  .option("--fix", "Fix the errors/warnings emitted by ESLint/Prettier.")
  .action(async (opts) => {
    if (opts.fix) {
      return series([
        () => exec(`npm exec prettier --write ${process.cwd()}`),
        () => exec(`npm exec eslint --fix --ignore-path .gitignore ${process.cwd()}`),
      ]);
    }

    series([
      () => exec(`npm exec prettier --check ${process.cwd()}`),
      () => exec(`npm exec eslint --ignore-path .gitignore ${process.cwd()}`),
    ]);
  });
