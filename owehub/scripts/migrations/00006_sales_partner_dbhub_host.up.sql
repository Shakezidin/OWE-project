-- Up Migration: Create Subscription
CREATE SUBSCRIPTION sales_partner_sub
CONNECTION 'host=149.248.3.82 port=5432 dbname=owe_db user=OwePostgres password=OwePostgres'
PUBLICATION sales_partner_pub
WITH (create_slot = true);