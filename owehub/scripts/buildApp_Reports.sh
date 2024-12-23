#!/bin/bash


AppRoot='../'
GuiRoot=

function moduleinit() 
{
	sh ./moduleInit.sh
}

function make_all() 
{
	cd $AppRoot/build
	make -f Makefile-OweHub-Reports
	cd -
}

function make_docker()
{

	cd $AppRoot/build
	make -f Makefile-OweHub-Reports docker
	cd -
}

function make_clean()
{
	cd $AppRoot/build
	make -f Makefile-OweHub-Reports clean
	cd -
}

function make_dockerclean()
{
    cd $AppRoot/build
	make -f Makefile-OweHub-Reports dockerpushclean
	cd -
}

if [ "$#" -eq 0 ] 
then
	echo "Usage ./buildApp.sh <arguments:make_all, make_clean, make_docker, make_doockerclean>"
elif [[ $1 == "make_docker" ]]
then
	echo $# $1
	moduleinit
	make_docker
elif [[ $1 == "make_clean" ]] 
then
	moduleinit
	make_clean
elif [[ $1 == "make_dockerclean" ]]
then
	moduleinit
	make_dockerclean
elif [[ $1 == "make_all" ]]
then
	moduleinit
	make_all
fi

