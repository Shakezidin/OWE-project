#!/bin/bash

AppRoot='../'

function make_docker()
{
	cd $AppRoot/build
	make docker
	cd -
}

function make_dockerclean()
{
    cd $AppRoot/build
	make dockerpushclean
	cd -
}

if [ "$#" -eq 0 ] 
then
	echo "Usage ./buildApp.sh <arguments:make_docker, make_doockerclean>"
elif [[ $1 == "make_docker" ]]
then
	echo $# $1
	make_docker
elif [[ $1 == "make_dockerclean" ]]
then
	moduleinit
	make_dockerclean
fi

