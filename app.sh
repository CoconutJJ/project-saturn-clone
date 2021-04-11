#!/bin/sh

docker build . -t saturn
docker build - -t alpine-sandbox < Backend/Dockerfile
docker run -p 8080:8080 -v /var/run/docker.sock:/var/run/docker.sock saturn
