import { getServer } from "../core/server";
import { cmd, config, logger } from "..";
cmd.command("server", "Start the HTTP server.").action(async () => {
    const server = await getServer();
    async function handler() {
        await server.close();
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
