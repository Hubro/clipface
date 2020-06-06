
import os
from datetime import datetime
from pathlib import Path

import timeago
from flask import jsonify


VIDEO_PATH = Path(os.environ.get("VIDEO_PATH", "."))


def format_time_ago(dt: datetime) -> str:
    return timeago.format(dt, datetime.now())


def handler():
    clips = VIDEO_PATH.glob("*.mkv")

    def get_stats(path: Path):
        stats = path.stat()
        mtime = datetime.fromtimestamp(stats.st_mtime)

        return {
            "filename": path.name,
            "saved_absolute": mtime,
            "saved_relative": format_time_ago(mtime),
            "size": stats.st_size,
        }

    payload = [get_stats(path) for path in VIDEO_PATH.glob("*.mkv")]

    # Sort the clips by filename, reversed
    payload = reversed(sorted(payload, key=lambda x: x["filename"]))

    return jsonify(list(payload))
