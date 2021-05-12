import { SUPPORTED_EXTS, getRouterPathFromFilename } from "./util";
import { getConfig } from "./config";

describe("util", () => {
  describe("#getRouterPathFromFilename", () => {
    const config = getConfig();

    function absPath(path: string): string {
      return `${config.routesPath}/${path}`;
    }

    const testCases = {
      index: "/",
      "orgs/index": "/orgs",
      "[org]/[id]": "/:org/:id",
      "[org]-[id]": "/:org-:id",
      "orgs/[org]-[id]": "/orgs/:org-:id",
      "[org]/[repo]/tree/[branch]/[...file]": "/:org/:repo/tree/:branch/:file*",
      "[org]/[repo]/tree/[...branch]/[file]": "/:org/:repo/tree/:branch*/:file",
    };

    for (const [fn, route] of Object.entries(testCases)) {
      for (const ext of SUPPORTED_EXTS) {
        test(`filename '${fn}${ext}' should be '${route}'`, () => {
          expect(getRouterPathFromFilename(absPath(`${fn}${ext}`))).toBe(route);
        });
      }
    }
  });
});
