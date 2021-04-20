import { default as config } from "../config";
import { default as logger } from "../logger";
import { default as server } from "../server";
import type { Cli } from "../cli";
import type { us_listen_socket } from "uWebSockets.js";

export default (cli: Cli): void => {
  cli.command("server", "Start the HTTP server.").action(() => {
    server.listen(config.host, config.port, (listenSocket: us_listen_socket) => {
      if (listenSocket) {
        server.listenSocket = listenSocket;
        logger.info(`Server is listening on http://${config.host}:${config.port}...`);
      }
    });
  });
};
