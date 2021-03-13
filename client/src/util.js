/**
 * Returns the full URL of the named clip
 *
 * This function can only be run in the browser, as it formats the URL using
 * the current location.
 *
 * @param {string} clipName
 * @returns {URL}
 */
export function formatClipURL(clipName) {
  return new URL(
    `/watch/${encodeURIComponent(clipName)}`,
    `${location.protocol}//${location.host}`
  );
}
