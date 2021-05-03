import sade from "sade";

export type Cmd = sade.Sade;

export function getCmd(): Cmd {
  return sade("./app");
}
