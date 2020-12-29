/**
 * Handles configuration
 *
 * This module should only be imported from server side code.
 */

import fs from "fs";
import toml from "toml";

let CONFIG = null;

/**
 * Returns the user password for Clipface
 *
 * If null is returned, authentication has not been configured.
 *
 * @returns {(string|null)}
 */
export function getUserPassword() {
  const config = getConfig();

  return config["user_password"] || null;
}

/**
 * Returns the clips path
 *
 * @returns {string}
 */
export function getClipsPath() {
  const config = getConfig();

  // Default to "/clips"
  if (!("clips_path" in config)) {
    return "/clips";
  }

  return config["clips_path"];
}

/**
 * Returns the secure cookies option, defaults to false
 *
 * @returns {boolean}
 */
export function getSecureCookies() {
  const config = getConfig();

  // Default to true
  if (!("secure_cookies" in config)) {
    return true;
  }

  return config["secure_cookies"];
}

/**
 * Returns the clips page title option, defaults to null
 *
 * @returns {string|null}
 */
export function getClipsPageTitle() {
  const config = getConfig();

  return config["clips_page_title"] || null;
}

/**
 * Returns the config file as an object, loads it from disk if necessary
 *
 * @return {object}
 */
function getConfig() {
  if (!CONFIG) {
    CONFIG = loadConfig();
  }

  return CONFIG;
}

/**
 * Loads and returns the config file
 *
 * @return {object}
 */
function loadConfig() {
  const configFilePath = process.env["CLIPFACE_CONFIG"];

  if (!configFilePath) {
    return {};
  }

  return toml.parse(fs.readFileSync(configFilePath));
}
