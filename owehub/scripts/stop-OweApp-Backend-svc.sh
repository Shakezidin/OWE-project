#!/bin/bash

# Get the directory path where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# Get the parent directory of the script's directory
BASE_DIR="$(dirname "$SCRIPT_DIR")"

DOCKER_PATH=$BASE_DIR/docker


DOCKER_COMPOSE_FILE="$DOCKER_PATH/docker-compose-backend.yaml"
echo "$DOCKER_COMPOSE_FILE"

if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
    echo "Cannot find the docker-compose-backend.yaml file $DOCKER_COMPOSE_FILE"
    exit 1
fi

# Change directory to the location of the docker-compose-backend.yaml file
cd "$DOCKER_PATH" || exit 1

# Stop the Docker containers using docker-compose
if [[ "$OSTYPE" == "darwin"* ]]; then
    docker compose -f docker-compose-backend.yaml down # macos specific command
else
    docker-compose -f docker-compose-backend.yaml down
fi

