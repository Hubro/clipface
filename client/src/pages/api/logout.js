/**
 * Logout handler
 *
 * All this does is remove the auth cookie.
 */

import cookie from "cookie";
import config from "config";

export default function login(req, res) {
  // Only POST is allowed on this route
  if (req.method != "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("auth", "", {
      expires: new Date("1900-01-01"),
      httpOnly: true,
      sameSite: true,
      secure: config.get("secure_cookies"),
      path: "/",
    })
  );
  res.end("OK\n");
}
