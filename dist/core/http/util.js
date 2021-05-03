import { getConfig } from "../config";
const config = getConfig();
export const srcRoutes = `${process.cwd()}/${config.nodeEnv === "development" ? "src" : "dist"}/routes`;
export async function useMiddleware(req, res, middleware) {
    for (let i = 0; i < middleware.length; i++) {
        if (res.isAborted || !(await middleware[i](req, res)))
            break;
    }
}
export function getRouteFromFilename(fn) {
    // eslint-disable-next-line
    const segments = fn.replace(`${srcRoutes}/`, "").split("/");
    return "/";
}
