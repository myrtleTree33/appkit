import nodemon from "nodemon";
import { default as cmd } from "./cmd";
const defaultPort = 9229;
cmd
    .command("start", "Start the server/worker in development mode.")
    .option("--inspect", "Start the V8 inspector for the server/worker. By default, the inspector port for server is 9229 and for worker is 9230 which can be modified by passing in a different port number.")
    .example("./app start --inspect=9229")
    .action((opts) => {
    const inspectPort = parseInt(opts.inspect);
    const server = nodemon({
        delay: 1,
        env: {
            NODE_ENV: "development",
            ...(opts.inspect
                ? {
                    NODE_OPTIONS: `--inspect=${isNaN(inspectPort) ? defaultPort : inspectPort}`,
                }
                : {}),
        },
        exec: "./app server",
        ext: "env,json,svelte,ts,tsx,vue",
        events: {
            start: "clear",
        },
        ignore: [".git", "node_modules", "*.test.ts", "*.test.tsx", "*.spec.ts", "*.spec.tsx"],
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
