import { config, logger, server } from "../core";
import { default as cmd } from "./cmd";
cmd.command("server", "Start the HTTP server.").action(async () => {
    function handler() {
        server.close();
    }
    try {
        process.on("SIGINT", handler);
        process.on("SIGTERM", handler);
        await server.listen(config.host, config.port, (listenSocket) => {
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
