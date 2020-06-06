/*
 * API route for downloading clips by name
 */

import path from "path";
import fs from "fs";
import { serveStatic } from "next/dist/next-server/server/serve-static";

const CLIPS_PATH = process.env.CLIPS_PATH;

if (CLIPS_PATH === undefined) {
  throw "CLIPS_PATH must be defined";
}

export default (req, res) => {
  const name = req.query.name;
  const clipPath = path.join(CLIPS_PATH, name);

  if (!fs.existsSync(clipPath)) {
    res.statusCode = 404;
    res.end();
    return;
  }

  serveStatic(req, res, clipPath);
};
