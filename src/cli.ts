import sade from "sade";

export interface Cli extends sade.Sade {}

function getCli(): Cli {
  const cli = sade("./app.ts");

  return cli;
}

export default getCli();
