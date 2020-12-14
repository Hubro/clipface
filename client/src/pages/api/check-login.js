/**
 * Login status checker
 */

import cookie from "cookie";

import { getUserPassword, getSecureCookies } from "../../backend/config";
import { checkAuth, hashPassword } from "../../backend/auth";

/**
 * API endpoint for checking the current login status
 *
 * Output looks like:
 *
 *     {"status": "STATUS_NAME"}
 *
 * Possible statuses:
 *
 * - NO_AUTHENTICATION: No authentication has been configured
 * - AUTHENTICATED: In this case the response will also have a "user" key that
 *     will be either "default" or "admin"
 * - NOT_AUTHENTICATED: When the user is not authenticated
 *
 */
export default async function checkLogin(req, res) {
  // Only GET is allowed on this route
  if (req.method != "GET") {
    res.statusCode = 405;
    res.end();
    return;
  }

  res.setHeader("Content-Type", "application/json");

  const userPassword = getUserPassword();

  if (!userPassword) {
    // No authentication is enabled for this site, so remove the cookie just in
    // case
    removeAuthCookie(res);

    res.end(JSON.stringify({ status: "NO_AUTHENTICATION" }));
    return;
  }

  const isAuthenticated = await checkAuth(req);

  if (isAuthenticated) {
    res.end(JSON.stringify({ status: "AUTHENTICATED" }) + "\n");
  } else {
    // Also remove the cookie, just in case
    removeAuthCookie(res);

    res.end(JSON.stringify({ status: "NOT_AUTHENTICATED" }) + "\n");
  }
}

function removeAuthCookie(res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("auth", "", {
      expires: new Date("1900-01-01"),
      httpOnly: true,
      sameSite: true,
      secure: getSecureCookies(),
      path: "/",
    })
  );
}
