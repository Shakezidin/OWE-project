#!/bin/bash

# Get the directory path where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# Get the parent directory of the script's directory
BASE_DIR="$(dirname "$SCRIPT_DIR")"

DOCKER_PATH=$BASE_DIR/docker

DOCKER_COMPOSE_FILE="$DOCKER_PATH/docker-compose-ui.yaml"
echo "$DOCKER_COMPOSE_FILE"

if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
    echo "Cannot find the docker-compose-ui.yaml file $$DOCKER_COMPOSE_FILE"
    exit 1
fi

# Change directory to the location of the docker-compose-ui.yaml file
cd "$DOCKER_PATH" || exit 1

# Start the Docker containers using docker-compose
if [[ "$OSTYPE" == "darwin"* ]]; then
    docker compose -f docker-compose-ui.yaml up -d # macos specific command
else
    docker-compose -f docker-compose-ui.yaml up -d
fi

cd -

