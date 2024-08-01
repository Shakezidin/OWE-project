#!/bin/bash

AppRoot='../'
export PATH=$PATH:/usr/local/go/bin

# Function to update text in a file using sed
update_ip() {
    local file="$1"
    local old_text="$2"
    local new_text="$3"
    sed -i "s|$old_text|$new_text|g" "$file"
}

# Get the IP address of the specified interface
interface="enp1s0"
ip_address=$(ip addr show "$interface" | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

# Update IP address in the file (gui/./.env)
update_ip "$AppRoot/gui/.env" "155.138.163.236" "$ip_address"

# Check if any argument is passed
if [ $# -eq 0 ]; then
    echo "No arguments provided. Usage: $0 {all|gui|backend|migrate_db|database}"
    exit 1
fi

# Check the argument and execute corresponding actions
case "$1" in
    all)
        ./restart_ui.sh
        ./migrate_postgres_image.sh
	./restart-owehub-backend.sh
        ;;
    gui)
        ./restart_ui.sh
        ;;
    backend)
        ./restart-owehub-backend.sh
	;;
    migrate_db)
        ./stop-OweApp-Backend-svc.sh
        ./migrate_postgres_image.sh
	./start-OweApp-Backend-svc.sh
        ;;
    database)
        ./stop-OweApp-Backend-svc.sh
        ./make_postgres_image.sh
        ./start-OweApp-Backend-svc.sh
        ;;
    *)
        echo "Invalid argument. Usage: $0 {deploy_all|gui|backend|database}"
        exit 1
        ;;
esac
