import { getServer } from "../core/server";
import { cmd, config, logger } from "..";
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
        server.listen(config.host, config.port, (listenSocket) => {
            if (listenSocket) {
                server.listenSocket = listenSocket;
                logger.info(`Server is listening on http://${config.host}:${config.port}...`);
            }
        });
    }
    catch (err) {
        logger.error(err);
    }
});
