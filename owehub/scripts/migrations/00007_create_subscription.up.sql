CREATE SUBSCRIPTION sub_155_236_dealer
CONNECTION 'host=149.248.3.82 port=5432 dbname=owe_db user=OwePostgres password=OwePostgres'
PUBLICATION sales_partner_pub
WITH (create_slot = true);
