import db from "../db";
import logger from "../logger";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli
    .command("db:migrate:new <name>", "Generate a new database migration file.")
    .example("db:migrate:new create_users")
    .action(() => {});
};
