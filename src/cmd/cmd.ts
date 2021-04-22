import sade from "sade";

export type Cmd = sade.Sade;

function getCmd(): Cmd {
  return sade("./app");
}

export default getCmd();
