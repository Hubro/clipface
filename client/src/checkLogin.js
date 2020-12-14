/*
 * Function for checking login status
 */

/**
 * Checks the login status with the API
 *
 * @async
 * @returns {Promise<object>}
 */
export default async function checkLogin() {
  const response = await fetch("/api/check-login");
  return await response.json();
}
