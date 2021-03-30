#!/bin/sh

cd Frontend
npm run build-dev
cd ../Backend
node server.js