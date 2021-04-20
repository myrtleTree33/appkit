import sade from "sade";
function getCli() {
    const cli = sade("./app");
    return cli;
}
export default getCli();
