import nodemon, { LogMessage } from "nodemon";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli.command("dev", "Start the server/worker in development mode.").action(() => {
    const server = nodemon({
      delay: 1,
      env: {
        NODE_ENV: "development",
      },
      exec: "./app server",
      ext: "env,json,ts",
      events: {
        start: "clear",
      },
      ignore: [".git", "node_modules", "*.test.ts", "*.spec.ts"],
      pollingInterval: 500,
      watch: ["configs", "src"],
    });

    server
      .on("crash", () => {})
      .on("log", (msg: LogMessage) => {})
      .on("quit", (code: number) => {})
      .on("restart", (files: string[]) => {
        // TODO: Delete all appkit's environment variables so that dotenv can reload the new values from development.env.
        delete process.env.DB_URI_PRIMARY;
      })
      .on("start", () => {})
      .on("stderr", (data: Buffer) => {})
      .on("stdout", (data: Buffer) => {})
      .on("watching", (files: string[]) => {});

    const handler = () => {
      server.emit("quit");

      // To prettify the console.
      console.log();
      process.exit(0);
    };

    process.on("SIGINT", handler);
    process.on("SIGTERM", handler);
  });
};
