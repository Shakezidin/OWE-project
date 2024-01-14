#!/bin/bash

rm -rf /var/postgres/*

#Generate initial data to insert in DB first
Repo=`pwd`/..
echo "Repo: $Repo"

cd $Repo/scripts/
docker build -f ../docker/Dockerfile-postgress -t postgres_pg14_custom:v1 .;

