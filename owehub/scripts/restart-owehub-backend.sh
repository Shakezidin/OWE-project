
./stop-OweApp-Backend-svc.sh

rm -rf /home/log/owe/owehub-*

export PATH=$PATH:/usr/local/go/bin

./buildApp_Main.sh make_clean
./buildApp_Main.sh make_all
./buildApp_Main.sh make_docker  

./buildApp_Calc.sh make_clean
./buildApp_Calc.sh make_all
./buildApp_Calc.sh make_docker  

./buildApp_Scheduling.sh make_clean
./buildApp_Scheduling.sh make_all
./buildApp_Scheduling.sh make_docker  

./buildApp_Leads.sh make_clean
./buildApp_Leads.sh make_all
./buildApp_Leads.sh make_docker

docker images

./start-OweApp-Backend-svc.sh
