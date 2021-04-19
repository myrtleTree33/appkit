import { default as config } from "../config";
import { default as logger } from "../logger";
import { default as server } from "../server";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli.command("server", "Start the HTTP server.").action(() => {
    server.listen(config.host, config.port, (listenSocket) => {
      if (listenSocket) {
        logger.info(`Server is listening on http://${config.host}:${config.port}...`);
      }
    });
  });
};
