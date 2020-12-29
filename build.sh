#!/bin/bash

set -xe

cd client
yarn
yarn build

cd ..
docker build --network=host -t clipface:latest .
