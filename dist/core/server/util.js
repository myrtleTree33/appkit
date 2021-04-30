import { config } from "..";
export const srcRoutes = `${process.cwd()}/${config.nodeEnv === "development" ? "src" : "dist"}/routes`;
export async function useMiddleware(res, req, middleware) {
    for (let i = 0; i < middleware.length; i++) {
        if (res.isAborted) {
            break;
        }
        await middleware[i](res, req);
    }
}
export function getRouteFromFilename(fn) {
    // eslint-disable-next-line
    const segments = fn.replace(`${srcRoutes}/`, "").split("/");
    return "/";
}
