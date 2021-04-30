export const useMiddleware = async (res, req, middleware) => {
    res.onAborted(() => {
        res.isAborted = true;
    });
    for (let i = 0; i < middleware.length; i++) {
        if (res.isAborted) {
            break;
        }
        await middleware[i](res, req);
    }
};
