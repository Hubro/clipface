/*
 * API route for generating tokens to authenticate single pages
 */

import { useAuth, makeSingleClipToken } from "../../backend/auth";
import { getUserPassword } from "../../backend/config";

export default useAuth(async (req, res) => {
  // Only POST is allowed on this route
  if (req.method != "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  res.setHeader("Content-Type", "application/json");

  const userPassword = getUserPassword();

  if (!userPassword) {
    res.statusCode = 400;
    res.end("Can't generate tokens when authentication is not configured\n");
    return;
  }

  if (!req.body || !("clipName" in req.body)) {
    res.statusCode = 400;
    res.end("Expected parameter: clipName\n");
    return;
  }

  const clipName = req.body["clipName"];

  const token = await makeSingleClipToken(clipName);

  res.end(JSON.stringify({ token: token }) + "\n");
});
