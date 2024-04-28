
./stop_backend_svc.sh
rm -rf /var/log/owe/*

./buildApp_backend.sh make_clean
./buildApp_backend.sh make_all
./buildApp_backend.sh make_docker  

docker images
./start_backend_svc.sh
