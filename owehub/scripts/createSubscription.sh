#!/bin/bash

# Get the system's IP address
IP_ADDRESS=$(hostname -I | awk '{print $1}')

# Extract the 1st and 4th octets from the IP
FIRST_OCTET=$(echo $IP_ADDRESS | cut -d'.' -f1)
FOURTH_OCTET=$(echo $IP_ADDRESS | cut -d'.' -f4)

# Create the subscription name
SUBSCRIPTION_NAME="sub_${FIRST_OCTET}_${FOURTH_OCTET}_dealer"

# Write the SQL command to a file
cat << EOF > ./migrations/00014_create_subscription.up.sql
CREATE SUBSCRIPTION ${SUBSCRIPTION_NAME}
CONNECTION 'host=149.248.3.82 port=5432 dbname=owe_db user=OwePostgres password=OwePostgres'
PUBLICATION sales_partner_pub
WITH (create_slot = true);
EOF

cat << EOF > ./migrations/00014_create_subscription.down.sql
-- Drop the subscription
DROP SUBSCRIPTION IF EXISTS ${SUBSCRIPTION_NAME};
EOF
# Run the SQL file
# psql -U OwePostgres -d owe_db -f create_subscription.sql

echo "Subscription ${SUBSCRIPTION_NAME} created successfully!"