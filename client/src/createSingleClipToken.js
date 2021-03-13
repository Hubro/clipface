/*
 * Function for creating a single page token
 */

/**
 * Creates a single page token using the API
 *
 * @async
 * @param {string} clipName The clip name that the new token will be valid for
 * @returns {Promise<object>}
 */
export default async function createSinglePageToken(clipName) {
  console.log("Requesting a single page token for path", clipName);

  const response = await fetch("/api/create-single-clip-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clipName: clipName }),
  });

  const data = await response.json();

  return data["token"];
}
