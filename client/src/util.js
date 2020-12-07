/**
 * Returns the full URL of the named clip
 *
 * This function can only be run in the browser, as it formats the URL using
 * the current location.
 *
 * @param {string} clipName
 */
export function formatClipURL(clipName) {
  const base = `${location.protocol}//${location.host}`;

  return `${base}/watch/${encodeURIComponent(clipName)}`;
}
