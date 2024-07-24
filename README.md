-----------------------------------------------------
How to Deploy
-----------------------------------------------------

Common Steps:
1) Goto owehub source code
	cd OweAppPlatform/owehub/scripts/

GUI Steps:
1) Update the IP Address in file OweAppPlatform/owehub/gui/.env for API endpoint
	REACT_APP_BASE_URL= http://155.138.163.236:31020/owe-commisions-service/v1
   With same IP or domain name where APP is deploying

2) RUN ./deploy-owehub.sh gui


Backend Steps:
1) export PATH=$PATH:/usr/local/go/bin

2) ./deploy-owehub.sh backend


Database Steps:
Run only if any DB schema is changed as it will clean all previous data
1) ./deploy-owehub.sh database
