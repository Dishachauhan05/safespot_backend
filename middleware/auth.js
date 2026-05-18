const { validateToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    let tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue && req.headers.authorization) {
      tokenCookieValue = req.headers.authorization.split(" ")[1];
    }
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) { }

    next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};