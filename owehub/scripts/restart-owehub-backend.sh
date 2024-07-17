
./stop-OweApp-Backend-svc.sh

rm -rf /home/log/owe/owehub-*

./buildApp_Main.sh make_clean
./buildApp_Main.sh make_all
./buildApp_Main.sh make_docker  

./buildApp_Calc.sh make_clean
./buildApp_Calc.sh make_all
./buildApp_Calc.sh make_docker  

./buildApp_Utils.sh make_clean
./buildApp_Utils.sh make_all
./buildApp_Utils.sh make_docker  

docker images

./start-OweApp-Backend-svc.sh
