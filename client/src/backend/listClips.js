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
  let clips = glob.sync(`${clipsPath}/*.@(mkv|mp4|json)`).sort().reverse();

  const clipsMeta = {};

  clips
    .filter((clipPath) => clipPath.endsWith(".json"))
    .forEach((metaPath) => {
      clipsMeta[path.basename(metaPath, ".json")] = JSON.parse(
        fs.readFileSync(metaPath)
      );
    });

  // Remove the metadata files from the clip list
  clips = clips.filter((clipPath) => !clipPath.endsWith(".json"));

  return clips.map((filePath) => {
    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    const meta = clipsMeta[fileName] || {};

    return {
      name: path.basename(filePath),
      size: stats.size,
      saved: stats.mtimeMs,
      title: meta.title || null,
      description: meta.description || null,
    };
  });
}
