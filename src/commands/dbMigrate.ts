import db from "../db";
import logger from "../logger";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli.command("db:migrate", "Run all the pending migrations.").action(() => {});
};
