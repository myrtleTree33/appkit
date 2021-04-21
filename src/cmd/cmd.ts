import sade from "sade";

export interface Cmd extends sade.Sade {}

function getCmd(): Cmd {
  return sade("./app");
}

export default getCmd();
