/*
 * API route for downloading clips by name
 */

import fs from "fs";
import path from "path";
import config from "config";

import { serveStatic } from "next/dist/next-server/server/serve-static";

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

  serveStatic(req, res, clipPath);
});
