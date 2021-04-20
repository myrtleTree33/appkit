import nodemon from "nodemon";
export default (cli) => {
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
            .on("crash", () => { })
            .on("log", (msg) => { })
            .on("quit", (code) => { })
            .on("restart", (files) => {
            // This is needed due to dotenv only loads the `*.env` values into `process.env` if the
            // environment variable isn't set yet.
            Object.keys(process.env).forEach((key) => {
                if (key.startsWith("APPKIT_")) {
                    delete process.env[key];
                }
            });
        })
            .on("start", () => { })
            .on("stderr", (data) => { })
            .on("stdout", (data) => { })
            .on("watching", (files) => { });
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
