#!/usr/bin/env bash

./node_modules/.bin/browserify client/deck/viewer.js -o public/js/deck/viewer.js "$@"