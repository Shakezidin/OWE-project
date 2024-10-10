#!/bin/bash

#Generate initial data to insert in DB first
Repo=`pwd`/..
echo "Repo: $Repo"

./createSubscription.sh

cd $Repo/scripts/
docker build -f ../docker/Dockerfile-migrate -t migrate_db_latest:v1 .;

