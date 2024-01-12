#!/bin/bash
export Root=$pwd
Root='../'

NRFGW=$Root/NRFGateway/build/

function moduleinit() 
{
	sh ./moduleInit.sh
}

function make_all() 
{
#	cd -
	cd $NRFGW
	make
	cd -
}

function make_docker()
{
	cd $NRFGW
	make docker
	cd -
}

function make_clean()
{
	cd $NRFGW
	make clean
	cd -
}

function make_dockerclean()
{
	cd $NRFGW
	make dockerpushclean
	cd -
}

if [ "$#" -eq 0 ] 
then
	echo "Usage ./compile.sh <arguments:make_all, make_clean, make_docker, make_doockerclean>"
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

