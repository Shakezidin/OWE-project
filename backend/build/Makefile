# Exporting GO system Variable

SERVICE_ROOT=${PWD}/../

GOFMT=gofmt -w
GOBUILD=go build -gcflags "-N -l" -v

# Exporting service specific variables
#GOGETFILES=golang.org/x/oauth2 golang.org/x/net github.com/gorilla/mux github.com/antihax
SERVICE_NAME=backend
APP_NAME=commissions.bin
APP_DIR=main

SERVICE_PATH=${PWD}/../../$(SERVICE_NAME)

APPTARGET=$(SERVICE_PATH)/bin/$(APP_NAME)

all: service 
	@echo "GOPATH: $(GOPATH)"

get: 
	@echo "go get all missing 3rd party dependencies..."
	go get $(GOGETFILES)
	for i in $(COMM_SUBDIRS); \
	do \
		echo "go-get for module $$i" ;  \
		(cd $$i ;  \
		make get; \
		) ;  \
	done

service: 
	@echo "Generating service executable..."
	$(GOFMT) $(SERVICE_PATH)/$(APP_DIR)/*.go
	$(GOBUILD) -o $(APPTARGET) $(SERVICE_PATH)/$(APP_DIR)/*.go

clean: ## Remove previous build
	@echo "Clean previous build"
	rm -fv $(APPTARGET)
	echo "Clean in module $(SERVICE_NAME)" ; 
	#cd $(SERVICE_PATH)/ || exit 1 ; \
	#make clean; 
	

docker: ## Create Docker Image
	@echo "Building commissions Docker Image $SERVICE_ROOT"
		cd $(SERVICE_ROOT)/ || exit 1 ; \
		docker build -f docker/Dockerfile-Owe-App -t commissions:v1 .; 
		
dockerpush: ## Create Docker Image
	@echo "Build and push commissions Docker Image"
	@echo "Registry Name $(DOCKER_REGISTRY)"
		cd $(SERVICE_PATH)/ || exit 1 ; \
		docker build -f docker/Dockerfile -t commissions:v1 .; \
        docker push commissions:v1 ; 

dockerpushclean: ## Create Docker Image
	@echo "Clean commissions docker Images From Registry.."
	echo "Removing Image commissions:v1" ; \
	cd $(SERVICE_PATH)/ ; \
	docker rmi commissions:v1 ; 

