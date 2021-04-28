import { execSync } from "child_process";
import { default as cmd } from "./cmd";

cmd.command("build", "Compile the Typescript source code into Javascript for production deployment.").action(() => {
  execSync("npm exec tsc", { stdio: "inherit" });
});
