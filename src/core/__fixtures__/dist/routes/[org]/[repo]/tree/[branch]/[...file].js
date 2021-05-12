export const get = async (req, res) => {
  return res.json({
    source: "js",
    cookies: req.cookies,
    signedCookies: req.signedCookies,
    headers: req.headers,
    query: req.query,
    params: req.params,
  });
};
