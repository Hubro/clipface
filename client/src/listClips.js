/*
 * Lists all clips
 */

import fs from "fs";
import path from "path";
import glob from "glob";

const CLIPS_PATH = process.env.CLIPS_PATH;

export default function listClips() {
  const clips = glob.sync(`${CLIPS_PATH}/*.mkv`).sort().reverse();

  return clips.map((filePath) => {
    const stats = fs.statSync(filePath);

    return {
      name: path.basename(filePath),
      size: stats.size,
      saved: stats.mtimeMs,
    };
  });
}
