DROP TABLE IF EXISTS leads_info;
DROP TABLE IF EXISTS leads_status;

DELETE FROM leads_info; -- TODO: find a way to preserve data

ALTER TABLE leads_info ALTER COLUMN zipcode TYPE INT;
ALTER TABLE leads_info ADD CONSTRAINT leads_info_zipcode_fkey FOREIGN KEY (zipcode) REFERENCES zipcodes(zipcode);