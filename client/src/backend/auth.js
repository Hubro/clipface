/**
 * Handles authentication
 *
 * This module should only be imported from server code.
 */

import bcrypt from "bcrypt";
import cookie from "cookie";

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
    } else {
      res.statusCode = 401;
      res.end();
      return;
    }
  };

  return wrapper;
}

/**
 * Checks authentication given a Next.js IncomingMessage object
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
