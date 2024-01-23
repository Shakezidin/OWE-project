CPATH=${PWD}

SERVICE_NAME=frontend
SERVICE_PATH=${PWD}/../../$(SERVICE_NAME)

docker: ## Create Docker Image
	@echo "Building GUI Frontend Docker Image"
		cd $(SERVICE_PATH)/ || exit 1 ; \
		docker build -f docker/Dockerfile -t commissions-ui:v1 .;

dockerpushclean:
	@echo "Clean GUI frontend Client Images"
	echo "Removing Image commissions-ui:v1" ; \
	cd $(SERVICE_PATH)/ ; \
	docker rmi commissions-ui:v1 ; 