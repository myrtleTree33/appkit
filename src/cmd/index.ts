import tinyGlob from "tiny-glob";

import { logger } from "../support";
import { default as cmd } from "./cmd";
import { default as appDev } from "./app-dev";
import { default as appServer } from "./app-server";
import { default as dbMigrate } from "./db-migrate";
import { default as dbMigrateNew } from "./db-migrate-new";
import { default as dbMigrateStatus } from "./db-migrate-status";
import { default as dbRollback } from "./db-rollback";
import { default as dbSeed } from "./db-seed";
import { default as dcDown } from "./dc-down";
import { default as dcUp } from "./dc-up";

appDev(cmd);
appServer(cmd);
dbMigrate(cmd);
dbMigrateNew(cmd);
dbMigrateStatus(cmd);
dbRollback(cmd);
dbSeed(cmd);
dcDown(cmd);
dcUp(cmd);

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
