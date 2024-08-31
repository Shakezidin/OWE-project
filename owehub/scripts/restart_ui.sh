
#./stop_ui_svc.sh
#rm -rf /var/log/owe-ui/*

./buildApp_ui.sh make_clean
./buildApp_ui.sh make_all
./buildApp_ui.sh make_docker  

docker images
./stop_ui_svc.sh
rm -rf /var/log/owe-ui/*
./start_ui_svc.sh
