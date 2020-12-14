/*
 * API route for downloading clips by name
 */

import fs from "fs";
import path from "path";

import { serveStatic } from "next/dist/next-server/server/serve-static";

import { useAuth } from "../../../backend/auth";
import { getClipsPath } from "../../../backend/config";

export default useAuth((req, res) => {
  const name = req.query.name;
  const clipPath = path.join(getClipsPath(), name);

  if (!fs.existsSync(clipPath)) {
    res.statusCode = 404;
    res.end();
    return;
  }

  serveStatic(req, res, clipPath);
});
