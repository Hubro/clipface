#!/bin/bash

set -xe

# Files/directories to clean up after script exits
CLEANUP=()

# Runs when this script exits
_clipface_build_cleanup() {
  echo "Cleaning up temporary files and directories..."

  for CLEANUP_PATH in "${CLEANUP[@]}"; do
    rm -rf "$CLEANUP_PATH" | true
  done
}

trap "_clipface_build_cleanup" EXIT

cd client
rm -rf .next
yarn
yarn build

# Compose the application in a temporary directory. This lets us add the
# application to the Docker image in one operation, reducing the number of
# images.
TMPDIR="$(mktemp -d)"
CLEANUP+=($TMPDIR)

mkdir $TMPDIR/app

cp package.json   $TMPDIR/app
cp yarn.lock      $TMPDIR/app
cp -r .next       $TMPDIR/app
cp -r config      $TMPDIR

rm -f $TMPDIR/config/local.toml | true   # Don't deploy the local config file

tar -czf docker-bundle.tgz -C $TMPDIR .
CLEANUP+=("$PWD/docker-bundle.tgz")

cd ..
docker build --network=host -t clipface:latest .
