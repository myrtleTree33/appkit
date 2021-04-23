import nodemon from "nodemon";
import { default as cmd } from "./cmd";

cmd.command("app:dev", "Start the server/worker in development mode.").action(() => {
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

  // Available events: crash, log, quit, start, stderr, stdout, watching.
  server.on("restart", () => {
    // This is needed due to dotenv only loads the `*.env` values into `process.env` if the
    // environment variable isn't set yet.
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("APPKIT_")) {
        delete process.env[key];
      }
    });
  });

  const handler = () => {
    server.emit("quit");

    // To prettify the console.
    console.log();
    process.exit(0);
  };

  process.on("SIGINT", handler);
  process.on("SIGTERM", handler);
});
