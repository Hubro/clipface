
import os
from pathlib import Path

from flask import Flask, request, send_from_directory, abort, make_response


VIDEO_PATH = Path(os.environ.get("VIDEO_PATH", "."))


def handler(name):
    if not VIDEO_PATH.joinpath(name).exists():
        return make_response("", 404)

    return send_from_directory(VIDEO_PATH, name)
