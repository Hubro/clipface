/*
 * API endpoint for listing all clips
 */

import fs from "fs";
import path from "path";
import glob from "glob";

const CLIPS_PATH = process.env.CLIPS_PATH;

export default (req, res) => {
  const clips = glob.sync(`${CLIPS_PATH}/*.mkv`).sort().reverse();

  const responsePayload = clips.map((filePath) => {
    const stats = fs.statSync(filePath);

    return {
      name: path.basename(filePath),
      size: stats.size,
      saved: stats.mtimeMs,
    };
  });

  res.end(JSON.stringify(responsePayload));
};
