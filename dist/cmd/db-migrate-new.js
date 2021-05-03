import { readFileSync, renameSync, writeFileSync } from "node:fs";
import prettier from "prettier";
const { format, resolveConfig } = prettier;
import { cmd, db, logger } from "..";
cmd
    .command("db:migrate:new <name>", "Generate a new database migration file.")
    .example("db:migrate:new create_users")
    .option("-t, --target", "The target database to work with.", "primary")
    .action(async (name, opts) => {
    try {
        if (!db[opts.target]) {
            throw new Error(`The '${opts.target}' database doesn't exist.`);
        }
        const fn = (await db[opts.target]?.migrate.make(name)) || "";
        const text = readFileSync(fn, "utf8");
        const prettierConfig = await resolveConfig(process.cwd());
        const prettifiedText = format(text, { parser: "typescript", ...prettierConfig } || undefined);
        await writeFileSync(fn, prettifiedText, { encoding: "utf8" });
        await renameSync(fn, fn.replace(".js", ".cjs"));
        logger.info(`Successfully created '${fn?.replace(process.cwd() + "/", "").replace(".js", ".cjs")}'!`);
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
    finally {
        db[opts.target]?.destroy();
    }
});
