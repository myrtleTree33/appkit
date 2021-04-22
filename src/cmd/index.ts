import tinyGlob from "tiny-glob";
import { logger } from "../support";
import { default as cmd } from "./cmd";
import { default as dbMigrate } from "./db-migrate";
import { default as dbMigrateNew } from "./db-migrate-new";
import { default as dbMigrateStatus } from "./db-migrate-status";
import { default as dbRollback } from "./db-rollback";
import { default as dbSeed } from "./db-seed";
import { default as down } from "./down";
import { default as up } from "./up";
import { default as dev } from "./dev";
import { default as server } from "./server";

dbMigrate(cmd);
dbMigrateNew(cmd);
dbMigrateStatus(cmd);
dbRollback(cmd);
dbSeed(cmd);
down(cmd);
up(cmd);
dev(cmd);
server(cmd);

export async function loadAppCommands(): Promise<void> {
  try {
    const files = await tinyGlob(`${process.cwd()}/src/commands/**/*.{ts}`);

    await Promise.all(
      files.map(async (f: string) => {
        await import(`${process.cwd()}/${f}`);
      })
    );
  } catch (err) {
    logger.warn(err.message);
  }
}

export default cmd;
export type { Cmd } from "./cmd";
