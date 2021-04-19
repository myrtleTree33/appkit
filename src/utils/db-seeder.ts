// TODO: Remove this file once knex.js updates line 93 to use ESM's await import.
import { readdirSync, statSync } from "fs";
import { Knex } from "knex";
import path from "path";
import _ from "lodash";

const { extend, flatten, includes } = _;

const getFilepathsInFolder = async (dir: string, recursive = false): Promise<string[]> => {
  const pathsList = readdirSync(dir);
  return flatten(
    await Promise.all(
      pathsList.sort().map(async (currentPath) => {
        const currentFile = path.resolve(dir, currentPath);
        const statFile = statSync(currentFile);

        if (statFile && statFile.isDirectory()) {
          if (recursive) {
            return await getFilepathsInFolder(currentFile, true);
          }
          return [];
        }

        return [currentFile];
      })
    )
  );
};

const filterByLoadExtensions = (extensions: readonly string[] | undefined) => (value: string) => {
  const extension = path.extname(value);
  return includes(extensions, extension);
};

export default class Seeder {
  config: Knex.SeederConfig;
  knex: Knex | null;

  constructor(knex: Knex) {
    this.knex = knex;
    this.config = this.setConfig(knex.client.config.seeds);
  }

  async run(): Promise<string[]> {
    let files = await this._listAll();
    return this._runSeeds(files);
  }

  // Lists all available seed files as a sorted array.
  async _listAll() {
    const { loadExtensions, recursive } = this.config;
    const seeds = flatten(
      await Promise.all(this._absoluteConfigDirs().map((d) => getFilepathsInFolder(d, recursive)))
    );

    // if true, each dir are already sorted
    // (getFilepathsInFolderRecursively does this)
    // if false, we need to sort all the seeds
    if (this.config.sortDirsSeparately) {
      return seeds.filter(filterByLoadExtensions(loadExtensions));
    } else {
      return seeds.filter(filterByLoadExtensions(loadExtensions)).sort();
    }
  }

  // Run seed files, in sequence.
  _runSeeds(seeds: string[]): Promise<string[]> {
    seeds.forEach((seed) => this._validateSeedStructure(seed));
    return this._waterfallBatch(seeds);
  }

  // Validates seed files by requiring and checking for a `seed` function.
  async _validateSeedStructure(filepath: string) {
    const seed = await import(filepath);
    if (typeof seed.seed !== "function") {
      throw new Error(`Invalid seed file: ${filepath} must have a seed function`);
    }
    return filepath;
  }

  // Runs a batch of seed files.
  async _waterfallBatch(seeds: string[]): Promise<string[]> {
    const { knex } = this;
    const log = [];

    for (const seedPath of seeds) {
      const seed = await import(seedPath);

      try {
        await seed.seed(knex);
        log.push(seedPath);
      } catch (originalError) {
        throw new Error(`Error while executing "${seedPath}" seed: ${originalError.message}`);
      }
    }

    return log;
  }

  /**
   * Return all the config directories
   * @returns {string[]}
   */
  _absoluteConfigDirs(): string[] {
    const directories = Array.isArray(this.config.directory)
      ? this.config.directory
      : [this.config.directory];
    return directories.map((directory: string) => {
      if (!directory) {
        console.warn(
          "Failed to resolve config file, knex cannot determine where to run or make seeds"
        );
      }
      return path.resolve(process.cwd(), directory);
    });
  }

  setConfig(config: Knex.SeederConfig | undefined): Knex.SeederConfig {
    return extend(
      {
        extension: "js",
        directory: "./seeds",
        loadExtensions: [".co", ".coffee", ".eg", ".iced", ".js", ".litcoffee", ".ls", ".ts"],
        timestampFilenamePrefix: false,
        sortDirsSeparately: false,
        recursive: false,
      },
      this.config || {},
      config
    );
  }
}
