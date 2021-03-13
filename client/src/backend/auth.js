/**
 * Handles authentication
 *
 * This module should only be imported from server code.
 */

import bcrypt from "bcrypt";
import cookie from "cookie";
import path from "path";

import { getUserPassword } from "./config";

/**
 * Middleware for handling authentication
 *
 * If no authentication is configured, this wrapper does nothing.
 *
 * @param {function} handler
 * @returns {function}
 */
export function useAuth(handler) {
  const userPassword = getUserPassword();

  const wrapper = async (req, res) => {
    if (await checkAuth(req)) {
      return handler(req, res);
    } else if (await checkSingleClipAuth(req)) {
      return handler(req, res);
    } else {
      res.statusCode = 401;
      res.end();
      return;
    }
  };

  return wrapper;
}

/**
 * Checks authentication given a http.IncomingMessage object
 *
 * @async
 * @param {IncomingMessage} req See https://nodejs.org/api/http.html
 * @returns {Promise<boolean>} Whether or not the user is authenticated
 */
export async function checkAuth(req) {
  // Fetches the auth token (the hashed user password) from the cookie, or
  // null if none is found
  const getAuthToken = () => {
    const rawCookie = req.headers["cookie"];

    if (!rawCookie) {
      return null;
    }

    return cookie.parse(rawCookie)["auth"] || null;
  };

  const userPassword = getUserPassword();

  // Always succeed auth check when no user authentication has been configured
  if (!userPassword) {
    return true;
  }

  const authToken = getAuthToken();

  return authToken && (await checkHashedPassword("default", authToken));
}

/**
 * Checks if this request has a valid single clip authentication token
 *
 * @param {http.IncomingMessage} req
 * @returns {Promise<boolean>}
 */
export async function checkSingleClipAuth(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = getToken(req);

  // Paths that should be validated by the single clip auth token
  const clipPaths = ["/watch", "/api/video"];

  const dirname = path.dirname(url.pathname);
  const clipname = decodeURIComponent(path.basename(url.pathname));

  if (token && clipPaths.includes(dirname)) {
    const singlePageAuthenticated = await checkSingleClipToken(token, clipname);

    return singlePageAuthenticated;
  }

  return false;
}

/**
 * Checks if a hashed password is valid
 *
 * @async
 * @param {string} user
 * @param {string} password
 * @returns {Promise<(object|null)>} Resulting hash, or null if login failed
 */
export async function checkHashedPassword(user, hashedPassword) {
  if (user != "default") {
    throw "Logging in as non-default user is not yet supported";
  }

  const userPassword = getUserPassword();

  return await bcrypt.compare(userPassword, hashedPassword);
}

/**
 * Hashes a password using bcrypt
 *
 * @async
 * @param {string} password
 * @return {Promise<string>} The hashed password
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt();

  return await bcrypt.hash(password, salt);
}

/**
 * Generates a token that will authenticate the user for viewing a single clip.
 *
 * This is done by hashing the name of the clip with the configured user
 * password. This means that all public clip links can be invalidated by
 * changing the user password, or the link for a single clip can be
 * invalidated by renaming the clip.
 *
 * @async
 * @param {string} clipName
 * @returns {string} The token
 */
export async function makeSingleClipToken(clipName) {
  console.debug("Generating single clip token for clip:", clipName);

  const userPassword = getUserPassword();

  if (!userPassword) {
    throw "Can't generate single clip tokens with no configured user password";
  }

  const salt = await bcrypt.genSalt();
  const token = await bcrypt.hash(userPassword + clipName, salt);

  console.debug("Generated single clip token:", token);

  return token;
}

/**
 * Checks if a single page token is valid for the given path
 *
 * @async
 * @param {string} token
 * @param {string} clipName
 * @returns {Promise<boolean>}
 */
export async function checkSingleClipToken(token, clipName) {
  console.debug("Validating token", token, "for clip name", clipName);

  const userPassword = getUserPassword();

  if (!userPassword) {
    throw "Can't validate single clip tokens with no configured user password";
  }

  const result = await bcrypt.compare(userPassword + clipName, token);

  console.debug("Result", result);

  return result;
}

/**
 * Helper for fetching the token from a http.IncomingMessage object
 *
 * @param {http.IncomingMessage} req
 * @returns {string|null}
 */
export function getToken(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.searchParams.has("token")) {
    // Token is Base64 encoded
    try {
      return Buffer.from(url.searchParams.get("token"), "base64").toString();
    } catch (e) {
      console.error("Failed to get token from query params:", e);
      return null;
    }
  }

  return null;
}
