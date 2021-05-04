export { config, db, logger } from "./globals";
import { getCmd, loadAppCommands } from "./cmd";
export const cmd = getCmd();
export async function bootstrap() {
    await loadAppCommands();
    cmd.parse(process.argv);
}
