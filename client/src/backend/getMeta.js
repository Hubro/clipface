/*
 * Exports a function for fetching clip metadata
 */

import fs from "fs";
import path from "path";
import config from "config";

import * as mime from "mime-types";

const CLIPS_PATH = config.get("clips_path");

/**
 * Returns metadata for a clip
 *
 * @param {string} clipFileName The name of the clip including the file extension
 * @returns {object}
 */
export default function getMeta(clipFileName) {
  const stats = fs.statSync(path.join(CLIPS_PATH, clipFileName));
  const clipBaseName = path.basename(clipFileName, path.extname(clipFileName));

  let meta = null;
  const metadataPath = path.join(CLIPS_PATH, clipBaseName + ".json");

  try {
    meta = JSON.parse(fs.readFileSync(metadataPath));
  } catch {
    meta = {};
  }

  return {
    name: clipFileName,
    mime: mime.lookup(clipFileName),
    size: stats.size,
    saved: stats.mtimeMs,
    title: meta.title || null,
    description: meta.description || null,
  };
}
