import db from "../db";
import logger from "../logger";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli
    .command("db:rollback", "Rollback the database migration to previous version.")
    .action(() => {});
};
