import tinyGlob from "tiny-glob";

import { logger } from "../core";
import { default as cmd } from "./cmd";
import { default as appDev } from "./app-dev";
import { default as appServer } from "./app-server";
import { default as appSetup } from "./app-setup";
import { default as appTeardown } from "./app-teardown";
import { default as dbMigrate } from "./db-migrate";
import { default as dbMigrateNew } from "./db-migrate-new";
import { default as dbMigrateStatus } from "./db-migrate-status";
import { default as dbRollback } from "./db-rollback";
import { default as dbSeed } from "./db-seed";

appDev(cmd);
appServer(cmd);
appSetup(cmd);
appTeardown(cmd);
dbMigrate(cmd);
dbMigrateNew(cmd);
dbMigrateStatus(cmd);
dbRollback(cmd);
dbSeed(cmd);

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
