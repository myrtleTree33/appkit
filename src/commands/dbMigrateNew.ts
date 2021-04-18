import prettier from "prettier";
import db from "../db";
import logger from "../logger";
import { Cli } from "../cli";
import { readFileSync, writeFileSync } from "node:fs";

const { format, resolveConfig } = prettier;

export default (cli: Cli): void => {
  cli
    .command("db:migrate:new <name>", "Generate a new database migration file.")
    .example("db:migrate:new create_users")
    .option("-t, --target", "The target database to work with.", "primary")
    .action(async (name, opts) => {
      try {
        const fn = (await db[opts.target]?.migrate.make(name)) || "";
        const text = readFileSync(fn, "utf8");
        const prettierConfig = await resolveConfig(process.cwd());
        const prettifiedText = format(
          text,
          { parser: "typescript", ...prettierConfig } || undefined
        );
        await writeFileSync(fn, prettifiedText, { encoding: "utf8" });

        logger.info(`Successfully created '${fn?.replace(process.cwd() + "/", "")}'!`);
      } catch (err) {
        logger.error(err);
        process.exit(1);
      } finally {
        db[opts.target]?.destroy();
      }
    });
};
