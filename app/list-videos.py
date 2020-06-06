
import os
from pathlib import Path

from flask import jsonify


VIDEO_PATH = Path(os.environ.get("VIDEO_PATH", "."))


def handler():
    return jsonify(
        [str(path.name) for path in VIDEO_PATH.glob("*.mkv")]
    )
