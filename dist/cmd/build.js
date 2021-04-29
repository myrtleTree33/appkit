import { execSync } from "child_process";
import { readFileSync, rmSync } from "fs";
import { resolve } from "path";
import { default as cmd } from "./cmd";
cmd.command("build", "Compile the Typescript source code into Javascript for production deployment.").action(() => {
    const tsconfig = JSON.parse(readFileSync(`${process.cwd()}/tsconfig.json`, "utf-8"));
    if (tsconfig.compilerOptions?.outDir) {
        rmSync(resolve(`${process.cwd()}/${tsconfig.compilerOptions?.outDir}`), { recursive: true, force: true });
    }
    execSync("npm exec tsc", { stdio: "inherit" });
});
