import { randomBytes } from "crypto";
import { cmd, logger } from "..";

cmd
  .command(
    "gen:secret",
    "Generate a cryptographically secure secret key (this is typically used to generate a secret for cookie sessions).  (only for NODE_ENV=development)"
  )
  .action(() => {
    try {
      console.log(randomBytes(64).toString("hex"));
    } catch (err) {
      logger.error(err);
      process.exit(1);
    }
  });
