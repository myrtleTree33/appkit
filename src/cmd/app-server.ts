import type { us_listen_socket } from "uWebSockets.js";

import { config, logger, server } from "../core";
import type { Cmd } from "./cmd";

export default (cmd: Cmd): void => {
  cmd.command("app:server", "Start the HTTP server.").action(() => {
    server.listen(config.host, config.port, (listenSocket: us_listen_socket) => {
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
