/**
 * Login handler
 */

import cookie from "cookie";

import { getUserPassword, getSecureCookies } from "../../backend/config";
import { hashPassword } from "../../backend/auth";

export default function login(req, res) {
  // Only POST is allowed on this route
  if (req.method != "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  const userPassword = getUserPassword();

  if (!userPassword) {
    res.statusCode = 400;
    res.end("User authentication not configured\n");
    return;
  }

  if (req.body && "password" in req.body) {
    if (userPassword == req.body["password"]) {
      console.log("User logged in successfully");

      hashPassword(userPassword).then((hashedPassword) => {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("auth", hashedPassword, {
            httpOnly: true,
            sameSite: true,
            secure: getSecureCookies(),
            path: "/",
            maxAge: 31536000, // One year
          })
        );
        res.end("OK\n");
      });

      return;
    }
  }

  res.statusCode = 400;
  res.end("Invalid password\n");
}
