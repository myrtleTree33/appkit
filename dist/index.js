export { cmd } from "./cmd";
export { db, config, logger } from "./core";
import { cmd, loadAppCommands } from "./cmd";
export async function bootstrap() {
    await loadAppCommands();
    cmd.parse(process.argv);
}
