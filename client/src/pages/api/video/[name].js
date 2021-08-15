/*
 * API route for downloading clips by name
 */

import fs from "fs";
import path from "path";

import config from "config";
import * as mime from "mime-types";

import { useAuth } from "../../../backend/auth";

const CLIPS_PATH = config.get("clips_path");

export default useAuth((req, res) => {
  const name = req.query.name;
  const clipPath = path.join(CLIPS_PATH, name);

  if (!fs.existsSync(clipPath)) {
    res.statusCode = 404;
    res.end();
    return;
  }

  serveVideo(req, res, clipPath);
});

/*
 * Serves a video using chunks
 *
 * Source: https://betterprogramming.pub/video-stream-with-node-js-and-html5-320b3191a6b6
 */
function serveVideo(req, res, videoPath) {
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": mime.lookup(videoPath),
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": mime.lookup(videoPath),
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
}
