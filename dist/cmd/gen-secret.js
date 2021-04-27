import { randomBytes } from "crypto";
import { logger } from "../core";
import { default as cmd } from "./cmd";
cmd
    .command("gen:secret", "Generate a cryptographically secure secret key (this is typically used to generate a secret for cookie sessions).")
    .action(() => {
    try {
        console.log(randomBytes(64).toString("hex"));
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
});