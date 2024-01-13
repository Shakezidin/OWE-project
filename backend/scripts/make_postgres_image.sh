#!/bin/bash

rm -rf /var/postgres/*

#Generate initial data to insert in DB first
SharedRepo=`pwd`/..
echo "SharedRepo: $SharedRepo"

cd $SharedRepo/scripts/
docker build -f ../Docker/Dockerfile-postgress -t timescale_pg14_custom:v1 .;

