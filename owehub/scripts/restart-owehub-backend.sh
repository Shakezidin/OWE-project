
./stop-OweApp-Backend-svc.sh

rm -rf /home/log/owe/owehub-*

export PATH=$PATH:/usr/local/go/bin

./buildApp_Main.sh make_clean
./buildApp_Main.sh make_all
./buildApp_Main.sh make_docker

docker images

./start-OweApp-Backend-svc.sh
