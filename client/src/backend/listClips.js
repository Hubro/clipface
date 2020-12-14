/*
 * Lists all clips
 *
 * This module should only be imported from server side code.
 */

import fs from "fs";
import path from "path";
import glob from "glob";

import { getClipsPath } from "./config";

export default function listClips() {
  const clipsPath = getClipsPath();
  const clips = glob.sync(`${clipsPath}/*.mkv`).sort().reverse();

  return clips.map((filePath) => {
    const stats = fs.statSync(filePath);

    return {
      name: path.basename(filePath),
      size: stats.size,
      saved: stats.mtimeMs,
    };
  });
}
