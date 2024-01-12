#!/bin/bash
#set -x

if [ "X$GOPATH" = "X" ]; then
    echo "Please set GOPATH and try again."
    exit
fi

CUSTOM_DIR=$PWD

source $CUSTOM_DIR/init.env

DOCKER_DIR=$CUSTOM_DIR/../Docker
DOCKER_FILE="$DOCKER_DIR/Dockerfile-Owe-$BASE_OS"

#Build ViNGC base docker image
if [ ! -f $DOCKER_FILE ];then
    echo "Check init.env options, file not exist: $DOCKER_FILE"
    exit
fi
echo "Building docker image for $DOCKER_FILE"
docker build --network=host -t Owe_base_os:v1 -f $DOCKER_FILE $DOCKER_DIR/


