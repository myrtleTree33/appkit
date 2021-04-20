import { default as config } from "../config";
import { default as logger } from "../logger";
import { default as server } from "../server";
export default (cli) => {
    cli.command("server", "Start the HTTP server.").action(() => {
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
};
