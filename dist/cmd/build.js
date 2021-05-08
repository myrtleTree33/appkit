import { execSync } from "child_process";
import logger from "core/logger";
import { readFileSync, rmSync } from "fs";
import { resolve } from "path";
import { cmd } from "..";
cmd
    .command("build", "Compile the TS source code into JS for production deployment.")
    .option("--noEmit", "Do not emit JS files, only for typechecking.")
    .action((opts) => {
    try {
        const tsconfig = JSON.parse(readFileSync(`${process.cwd()}/tsconfig.json`, "utf-8"));
        if (opts.noEmit) {
            execSync("npm exec tsc -- --noEmit", { stdio: "inherit" });
            return;
        }
        if (tsconfig.compilerOptions?.outDir) {
            rmSync(resolve(`${process.cwd()}/${tsconfig.compilerOptions?.outDir}`), { recursive: true, force: true });
        }
        execSync("npm exec tsc", { stdio: "inherit" });
    }
    catch (err) {
        logger.error(err);
        process.exit(-1);
    }
});
