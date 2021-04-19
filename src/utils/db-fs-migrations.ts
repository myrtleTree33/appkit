// @ts-nocheck
// TODO: Remove this file once knex.js updates line 93 to use ESM's await import.
import path from "path";
import _ from "lodash";
import { readdirSync } from "node:fs";
import { Knex } from "knex";

const { sortBy } = _;

const DEFAULT_LOAD_EXTENSIONS = Object.freeze([
  ".co",
  ".coffee",
  ".eg",
  ".iced",
  ".js",
  ".cjs",
  ".litcoffee",
  ".ls",
  ".ts",
]);

export default class FsMigrations {
  loadExtensions: readonly string[] | undefined;
  migrationsPaths: readonly string[] | undefined;
  sortDirsSeparately: boolean | undefined;

  constructor(
    migrationDirectories: string | readonly string[] | undefined,
    sortDirsSeparately: boolean | undefined,
    loadExtensions: readonly string[] | undefined
  ) {
    this.sortDirsSeparately = sortDirsSeparately;

    if (typeof migrationDirectories === "string" && !Array.isArray(migrationDirectories)) {
      migrationDirectories = [migrationDirectories];
    }

    this.migrationsPaths = migrationDirectories;
    this.loadExtensions = loadExtensions || DEFAULT_LOAD_EXTENSIONS;
  }

  /**
   * Gets the migration names
   * @returns Promise<string[]>
   */
  async getMigrations(loadExtensions: readonly string[] | undefined): Promise<Knex.Migration[]> {
    const readMigrationsPromises = this.migrationsPaths?.map(async (configDir: string) => {
      const absoluteDir = path.resolve(process.cwd(), configDir);
      const files = await readdirSync(absoluteDir);

      return {
        files,
        configDir,
        absoluteDir,
      };
    });

    return Promise.all(readMigrationsPromises).then((allMigrations) => {
      const migrations = allMigrations.reduce((acc, migrationDirectory) => {
        // When true, files inside the folder should be sorted
        if (this.sortDirsSeparately) {
          migrationDirectory.files = migrationDirectory.files.sort();
        }

        migrationDirectory.files.forEach((file) =>
          acc.push({ file, directory: migrationDirectory.configDir })
        );

        return acc;
      }, []);

      // If true we have already sorted the migrations inside the folders
      // return the migrations fully qualified
      if (this.sortDirsSeparately) {
        return filterMigrations(this, migrations, loadExtensions || this.loadExtensions);
      }

      return filterMigrations(
        this,
        sortBy(migrations, "file"),
        loadExtensions || this.loadExtensions
      );
    });
  }

  getMigrationName(migration) {
    return migration.file;
  }

  async getMigration(migration): Promise<Knex.Migration> {
    const absoluteDir = path.resolve(process.cwd(), migration.directory);
    const _path = path.join(absoluteDir, migration.file);
    return await import(_path);
  }
}

function filterMigrations(migrationSource, migrations, loadExtensions) {
  return migrations.filter((migration: string) => {
    const migrationName = migrationSource.getMigrationName(migration);
    const extension = path.extname(migrationName);
    return loadExtensions.includes(extension);
  });
}
