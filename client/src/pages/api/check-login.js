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
 * - AUTHENTICATED: In this case the response will also have a "user" key that
 *     will be either "default" or "admin"
 * - NOT_AUTHENTICATED: When the user is not authenticated
 *
 * If no user authentication is configured, this will always return
 * "AUTHENTICATED" with the user "default".
 */
export default async function checkLogin(req, res) {
  // Only GET is allowed on this route
  if (req.method != "GET") {
    res.statusCode = 405;
    res.end();
    return;
  }

  res.setHeader("Content-Type", "application/json");

  const isAuthenticated = await checkAuth(req);

  if (isAuthenticated) {
    res.end(JSON.stringify({ status: "AUTHENTICATED" }) + "\n");
  } else {
    // Also remove the cookie, just in case
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth", "", { expires: new Date("1900-01-01") })
    );

    res.end(JSON.stringify({ status: "NOT_AUTHENTICATED" }) + "\n");
  }
}
