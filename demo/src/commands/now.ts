import { cmd } from "@appist/appkit";

cmd.command("now", "Display the current time in UTC format.").action(async () => {
  console.log(new Date().toUTCString());
});
