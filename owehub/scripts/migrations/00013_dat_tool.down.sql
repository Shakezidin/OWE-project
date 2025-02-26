/***************************** Drop Tables for Dat Tool DB ************************************************/

-- Migration file to drop all tables and constraints in PostgresSQL

-- Drop tables in reverse order to handle foreign key dependencies
DROP TABLE IF EXISTS inverter CASCADE;
DROP TABLE IF EXISTS existing_pv_system_info CASCADE;
DROP TABLE IF EXISTS measurement_conversion CASCADE;
DROP TABLE IF EXISTS roof_coverage_calculator CASCADE;
DROP TABLE IF EXISTS electrical_equipment_info CASCADE;
DROP TABLE IF EXISTS electrical_system_info CASCADE;
DROP TABLE IF EXISTS site_info CASCADE;
DROP TABLE IF EXISTS ess_interconnection CASCADE;
DROP TABLE IF EXISTS pv_interconnection CASCADE;
DROP TABLE IF EXISTS adder_items CASCADE;
DROP TABLE IF EXISTS adders CASCADE;
DROP TABLE IF EXISTS note_type CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS dat_information CASCADE;
DROP TABLE IF EXISTS project2revision CASCADE;

