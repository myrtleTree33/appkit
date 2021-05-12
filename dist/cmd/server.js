import { getServer } from "../core/server";
import { cmd, logger } from "..";
import { db } from "../globals";
cmd.command("server", "Start the HTTP server.").action(async () => {
    const server = await getServer();
    async function handler(sig) {
        console.log();
        logger.info(`Server is gracefully shutting down${sig ? ` upon receiving ${sig}` : ""}...`);
        await server.close();
        for (const key in db) {
            await db[key]?.destroy();
        }
    }
    try {
        process.on("SIGINT", handler);
        process.on("SIGTERM", handler);
        server.listen();
    }
    catch (err) {
        logger.error(err);
    }
});
