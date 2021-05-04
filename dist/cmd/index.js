import { dirname } from "path";
import tinyGlob from "tiny-glob";
import { fileURLToPath } from "url";
import { config, logger } from "..";
export async function loadAppCommands() {
    try {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const builtinFiles = await tinyGlob(`${__dirname}/**/*.{js}`, {
            absolute: true,
            filesOnly: true,
        });
        for (const f of builtinFiles) {
            if (f.endsWith("cmd.js") || f.endsWith("index.js"))
                continue;
            await import(f);
        }
        const appFiles = await tinyGlob(`${process.cwd()}/${config.entryRoot}/commands/**/*.${config.nodeEnv === "development" ? "ts" : "js"}`, {
            absolute: true,
            filesOnly: true,
        });
        for (const f of appFiles) {
            await import(f);
        }
    }
    catch (err) {
        logger.warn(err.message);
    }
}
export { getCmd } from "./cmd";
