import { execSync } from "child_process";
import { default as cmd } from "./cmd";
cmd
    .command("test:unit", "Run unit tests with Jest.")
    .option("--ci", `Whether to run Jest in continuous integration (CI) mode. This option is on by default in most popular CI environments. It will prevent snapshots from being written unless explicitly requested.`, false)
    .option("--coverage", "Indicates that test coverage information should be collected and reported in the output.", false)
    .option("-t, --testNamePattern", "Run only tests with a name that matches the regex pattern.")
    .option("-u, --updateSnapshot", `Use this flag to re-record snapshots. Can be used together with a test suite pattern or with \`--testNamePattern\` to re-record snapshot for test matching the pattern.`, false)
    .option("--watch", "Watch files for changes and rerun tests related to changed files.", false)
    .action(async (opts) => {
    const args = [];
    if (opts.ci)
        args.push("--ci");
    if (opts.coverage)
        args.push("--coverage");
    if (opts.testNamePattern || opts.t)
        args.push("--testNamePattern");
    if (opts.updateSnapshot || opts.u)
        args.push("--updateSnapshot");
    if (opts.watch)
        args.push("--watch");
    execSync(`npm exec jest -- ${args.join(" ")}`, { stdio: "inherit" });
});
