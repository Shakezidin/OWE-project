#!/bin/bash

export GOPATH=${PWD}/../../:${PWD}/:${PWD}/../
echo -e "\nGOPATH: $GOPATH"

current_path=`pwd`
echo "current_path: $current_path" 
#export GOMODFILE=$GOPATH/go.mod
echo "GOMODFILE: $GOMODFILE"
cd ../
go mod init OweApp
go mod tidy
go mod tidy -compat=1.17
cd -
