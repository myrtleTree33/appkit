import { config, logger, server } from "../core";
import { default as cmd } from "./cmd";
cmd.command("app:server", "Start the HTTP server.").action(() => {
    server.listen(config.host, config.port, (listenSocket) => {
        if (listenSocket) {
            server.listenSocket = listenSocket;
            logger.info(`Server is listening on http://${config.host}:${config.port}...`);
        }
    });
    function handler() {
        server.close();
    }
    process.on("SIGINT", handler);
    process.on("SIGTERM", handler);
});
