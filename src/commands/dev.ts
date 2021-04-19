import nodemon, { LogMessage } from "nodemon";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli
    .command("dev", "Start the server/worker in development mode.", { default: true })
    .action(() => {
      const server = nodemon({
        delay: 1,
        env: {
          NODE_ENV: "development",
        },
        exec: "./app.ts server",
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
        .on("restart", (files: string[]) => {})
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
