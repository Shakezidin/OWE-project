
rm -rf /var/postgresql/data/

./stop_svc.sh 
rm -rf /var/log/owe/*

./buildApp.sh make_clean
./buildApp.sh make_all
./buildApp.sh make_docker  

docker images
./start_svc.sh 
