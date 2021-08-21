#!/bin/bash
#
# This script bundles the built application into a neat tar archive that can be
# added to the Docker image in one operation, reducing the number of images.
#

set -xe

cd client

TMPDIR="$(mktemp -d)"
CLEANUP+=($TMPDIR)

mkdir $TMPDIR/app

cp package.json     $TMPDIR/app
cp yarn.lock        $TMPDIR/app
cp next.config.js   $TMPDIR/app
cp -r .next         $TMPDIR/app
cp -r config        $TMPDIR

rm -f $TMPDIR/config/local.toml | true   # Don't deploy the local config file

tar -czf docker-bundle.tgz -C $TMPDIR .
