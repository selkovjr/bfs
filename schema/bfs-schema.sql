BEGIN TRANSACTION;

CREATE EXTENSION SEG;
  
CREATE SEQUENCE location_id_seq;

CREATE TABLE "samples" (
  "id" TEXT NOT NULL,
  "emc_id" TEXT,
  "date" DATE,
  "species" INT,
  "age" TEXT,
  "sex" CHAR(1),
  "ring" TEXT,
  "clin_st" TEXT,
  "vital_st" TEXT,
  "tos" TEXT,
  "capture_method" TEXT,
  "location" INT,
  "type" TEXT
);

ALTER TABLE ONLY "samples"
   ADD CONSTRAINT "samples_pkey" PRIMARY KEY ( "id" );

COMMENT ON TABLE "samples" IS 'Field sample data';

COMMENT ON COLUMN "samples"."id" IS 'sample id';
COMMENT ON COLUMN "samples"."emc_id" IS 'EMC Serial No.';
COMMENT ON COLUMN "samples"."date" IS 'Sampling date';
COMMENT ON COLUMN "samples"."species" IS 'Refernce to Avibase taxonomy';
COMMENT ON COLUMN "samples"."age" IS 'Age estimate';
COMMENT ON COLUMN "samples"."sex" IS 'Sex';
COMMENT ON COLUMN "samples"."ring" IS 'Ring number';
COMMENT ON COLUMN "samples"."clin_st" IS 'Clinical status of the bird';
COMMENT ON COLUMN "samples"."vital_st" IS 'Vital status of the bird';
COMMENT ON COLUMN "samples"."tos" IS 'Type of surveillance';
COMMENT ON COLUMN "samples"."location" IS 'location id';
COMMENT ON COLUMN "samples"."type" IS 'Type of diagnostic sample';

CREATE TABLE "diagnostics" (
  "sample" TEXT,
  "rec_date" DATE,
  "date" DATE,
  "pool" INT,
  "ma_status" CHAR(1),
  "ma_ct" SEG,
  "h5_status" CHAR(1),
  "h5_ct" SEG,
  "h5_pt" TEXT,
  "h7_status" CHAR(1),
  "h7_ct" SEG,
  "h7_pt" TEXT,
  "h9_status" CHAR(1),
  "h9_ct" SEG,
  "ndv_status" CHAR(1),
  "ndv_ct" SEG
);

COMMENT ON TABLE "diagnostics" IS 'Data from the Diagnostic Laboratory';

COMMENT ON COLUMN "diagnostics"."sample" IS 'sample id';
COMMENT ON COLUMN "diagnostics"."rec_date" IS 'Date when the sample arrives in the lab';
COMMENT ON COLUMN "diagnostics"."date" IS 'TaqMan date';
COMMENT ON COLUMN "diagnostics"."pool" IS 'Pool ID';
COMMENT ON COLUMN "diagnostics"."ma_status" IS 'MA status';
COMMENT ON COLUMN "diagnostics"."ma_ct" IS 'MA Ct value';
COMMENT ON COLUMN "diagnostics"."h5_status" IS 'H5 status';
COMMENT ON COLUMN "diagnostics"."h5_ct" IS 'H5 Ct value';
COMMENT ON COLUMN "diagnostics"."h5_pt" IS 'Virus pathotype';
COMMENT ON COLUMN "diagnostics"."h7_status" IS 'H7 status';
COMMENT ON COLUMN "diagnostics"."h7_ct" IS 'H7 Ct value';
COMMENT ON COLUMN "diagnostics"."h7_pt" IS 'Virus pathotype';
COMMENT ON COLUMN "diagnostics"."h9_status" IS 'H9 status';
COMMENT ON COLUMN "diagnostics"."h9_ct" IS 'H9 Ct value';
COMMENT ON COLUMN "diagnostics"."ndv_status" IS 'Newcastle Disease Virus test';
COMMENT ON COLUMN "diagnostics"."ndv_ct" IS 'Ct value of the NDV test';

CREATE TABLE "cultures" (
  "sample" TEXT,
  "id" TEXT,
  "e1" TEXT,
  "e2" TEXT,
  "isolation" BOOL,
  "ndv" BOOL,
  "ndv-f-seq" SEG,
  "pathotype" TEXT,
  "ha_subtype" TEXT,
  "na_subtype" TEXT,
  "name" TEXT
);

COMMENT ON TABLE "cultures" IS 'Culture test data';

COMMENT ON COLUMN "cultures"."sample" IS 'sample id';
COMMENT ON COLUMN "cultures"."id" IS 'AHVLA id';
COMMENT ON COLUMN "cultures"."e1" IS 'First egg passage';
COMMENT ON COLUMN "cultures"."e2" IS 'Second egg passage';
COMMENT ON COLUMN "cultures"."isolation" IS 'Isolation successful';
COMMENT ON COLUMN "cultures"."ndv" IS 'Newcastle Disease Virus culture';
COMMENT ON COLUMN "cultures"."ndv-f-seq" IS 'NDV F-protein sequence';
COMMENT ON COLUMN "cultures"."pathotype" IS 'Virus pathotype';
COMMENT ON COLUMN "cultures"."ha_subtype" IS 'Haemagglutinin subtype';
COMMENT ON COLUMN "cultures"."na_subtype" IS 'Neuraminidase subtype';
COMMENT ON COLUMN "cultures"."name" IS 'The name of the isolate';

CREATE TABLE "sequences" (
  "sample" TEXT,
  "segment" TEXT,
  "data" TEXT
);

COMMENT ON TABLE "sequences" IS 'Sample sequence data';

COMMENT ON COLUMN "sequences"."sample" IS 'sample id';
COMMENT ON COLUMN "sequences"."segment" IS 'RNA segment';
COMMENT ON COLUMN "sequences"."data" IS 'DNA/RNA Sequence';

CREATE TABLE "notes" (
  "class" TEXT,
  "id" TEXT,
  "attr" TEXT,
  "user" TEXT,
  "when" TIMESTAMP,
  "text" TEXT
);

COMMENT ON TABLE "notes" IS 'Annotations for table data';

COMMENT ON COLUMN "notes"."class" IS 'Database class (table)';
COMMENT ON COLUMN "notes"."id" IS 'Row id';
COMMENT ON COLUMN "notes"."attr" IS 'Class attribute';
COMMENT ON COLUMN "notes"."user" IS 'The id of the user who left the note';
COMMENT ON COLUMN "notes"."when" IS 'Autocomplete option';
COMMENT ON COLUMN "notes"."text" IS 'Note text';

CREATE TABLE "sera" (
  "sample" TEXT,
  "date" DATE,
  "status" CHAR(1),
  "plate" TEXT
);

COMMENT ON TABLE "sera" IS 'Serology test';

COMMENT ON COLUMN "sera"."sample" IS 'sample id ';
COMMENT ON COLUMN "sera"."date" IS 'Serology testing date';
COMMENT ON COLUMN "sera"."status" IS 'Serology status';
COMMENT ON COLUMN "sera"."plate" IS 'Serology plate reading';

CREATE TABLE "locations" (
  "id" INTEGER DEFAULT nextval('location_id_seq'),
  "name" TEXT,
  "province" TEXT,
  "lat" SEG,
  "long" SEG
);

ALTER TABLE ONLY "locations"
   ADD CONSTRAINT "locations_pkey" PRIMARY KEY ( "id" );

COMMENT ON TABLE "locations" IS 'Sample collection site';

COMMENT ON COLUMN "locations"."id" IS 'database key';
COMMENT ON COLUMN "locations"."name" IS 'Name';
COMMENT ON COLUMN "locations"."province" IS 'State/province';
COMMENT ON COLUMN "locations"."lat" IS 'Latitude, decimal';
COMMENT ON COLUMN "locations"."long" IS 'Longitude, decimal';

COPY "locations" ( "id", "name", "province", "lat", "long" ) FROM stdin;
1	Poti Sea Port	Samegrelo	42.1494	41.6549
2	Paliastomi Lake	Samegrelo	42.1228	41.7345
3	Grigoleti	Guria	42.0409	41.7375
4	Hunting shop 1	Guria	42.01115	41.77978
5	Natanebi	Guria	41.9046	41.8039
6	Chorokhi Delta	Ajara	41.5952	41.5796
7	Khanchali Lake	Samtskhe-Javakheti	41.2562	43.5502
8	Bughdasheni Lake	Samtskhe-Javakheti	41.2014	43.6861
9	Madatapha  Lake	Samtskhe-Javakheti	41.1781	43.7842
10	Tbilisi	Tbilisi	41.7118	44.7898
11	Kumisi Lake	Kvemo Kartli	41.5849	44.8636
12	Ponichala Park	Tbilisi	41.6293	44.9307
13	Rustavi	Tbilisi	41.5738	45.0044
14	Jandari Lake	Kvemo Kartli	41.4458	45.1988
15	Krasnogorski	Kakheti	41.7360	45.3400
16	Telavi	Kakheti	41.9674	45.5260
17	Heretskari	Kakheti	41.7090	46.0871
18	Beshkenti	Kakheti	41.7009	46.1512
19	Lagodekhi	Kakheti	41.6589	46.1908
-1	village		\N	\N
\.

CREATE TABLE "birds" (
  "id" INT NOT NULL,
  "family" TEXT,
  "genus" TEXT,
  "species" TEXT,
  "name" TEXT,
  "common_name" TEXT
);

ALTER TABLE ONLY "birds"
   ADD CONSTRAINT "birds_pkey" PRIMARY KEY ( "id" );

COMMENT ON TABLE "birds" IS 'Bird taxonomy';

COMMENT ON COLUMN "birds"."id" IS 'Avibase id (wbdb)';
COMMENT ON COLUMN "birds"."family" IS 'Family';
COMMENT ON COLUMN "birds"."genus" IS 'Genus';
COMMENT ON COLUMN "birds"."species" IS 'Species';
COMMENT ON COLUMN "birds"."name" IS 'Sceintific name';
COMMENT ON COLUMN "birds"."common_name" IS 'Common name';

CREATE TABLE "ac" (
  "class" TEXT,
  "attr" TEXT,
  "ord" INT,
  "val" TEXT,
  "desc" TEXT
);

COMMENT ON TABLE "ac" IS 'Autocomplete values for the GUI';

COMMENT ON COLUMN "ac"."class" IS 'Database class (table)';
COMMENT ON COLUMN "ac"."attr" IS 'Class attribute';
COMMENT ON COLUMN "ac"."ord" IS 'Ordinal number in the list of values';
COMMENT ON COLUMN "ac"."val" IS 'Autocomplete option';
COMMENT ON COLUMN "ac"."desc" IS 'Human-readable description of the option';

ALTER TABLE ONLY "samples"
   ADD CONSTRAINT "$1" FOREIGN KEY ("location") REFERENCES "locations" ON DELETE CASCADE;

ALTER TABLE ONLY "samples"
   ADD CONSTRAINT "$2" FOREIGN KEY ("species") REFERENCES "birds" ON DELETE CASCADE;

ALTER TABLE ONLY "diagnostics"
   ADD CONSTRAINT "$1" FOREIGN KEY ("sample") REFERENCES "samples" ON DELETE CASCADE;

ALTER TABLE ONLY "sera"
   ADD CONSTRAINT "$1" FOREIGN KEY ("sample") REFERENCES "samples" ON DELETE CASCADE;

ALTER TABLE ONLY "notes"
   ADD CONSTRAINT "$1" FOREIGN KEY ("id") REFERENCES "samples" ON DELETE CASCADE;

ALTER TABLE ONLY "cultures"
   ADD CONSTRAINT "$1" FOREIGN KEY ("sample") REFERENCES "samples" ON DELETE CASCADE;

ALTER TABLE ONLY "sequences"
   ADD CONSTRAINT "$1" FOREIGN KEY ("sample") REFERENCES "samples" ON DELETE CASCADE;

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
samples	age	0	adult	\N
samples	age	1	subadult	\N
samples	age	2	juvenile	\N
samples	age	3	first year	\N
samples	age	4	second year	\N
samples	age	5	undetermined	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
samples	sex	0	F	Female
samples	sex	1	M	Male
samples	sex	2	U	Unidentified
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
samples	clin_st	0	normal	\N
samples	clin_st	1	abnormal	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
samples	vital_st	0	live	\N
samples	vital_st	1	hunted	\N
samples	vital_st	2	found dead	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
samples	tos	0	A	Active surveillance (e.g. trap); sampling not initiated by an outbreak
samples	tos	1	F	Farm Sample
samples	tos	2	K	Opportunistically sampled (e.g., hunter-killed or killed in order to take sample)
samples	tos	3	M	Market Sample
samples	tos	4	O	Sample collected in response to outbreak (sick or dying birds)
samples	tos	5	U	Undetermined
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
samples	capture_method	0	trap	\N
samples	capture_method	1	mist net	\N
samples	capture_method	2	hunted	\N
samples	capture_method	3	domestic caught	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
samples	type	0	tracheal/op swab	\N
samples	type	1	cloacal swab	\N
samples	type	2	fresh faeces	\N
samples	type	3	other	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
diagnostics	ma_status	0	+	positive
diagnostics	ma_status	1	-	negative
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
diagnostics	h5_status	0	+	positive
diagnostics	h5_status	1	-	negative
diagnostics	h5_status	2	i	inconclusive
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
diagnostics	h5_pt	0	HPAI	\N
diagnostics	h5_pt	1	LPAI	\N
diagnostics	h5_pt	2	unidentifiable	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
diagnostics	h7_status	0	+	positive
diagnostics	h7_status	1	-	negative
diagnostics	h7_status	2	i	inconclusive
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
diagnostics	h7_pt	0	HPAI	\N
diagnostics	h7_pt	1	LPAI	\N
diagnostics	h7_pt	2	unidentifiable	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
diagnostics	h9_status	0	+	positive
diagnostics	h9_status	1	-	negative
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
diagnostics	ndv_status	0	+	positive
diagnostics	ndv_status	1	-	negative
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
cultures	isolation	0	t	\N
cultures	isolation	1	f	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
cultures	ndv	0	t	\N
cultures	ndv	1	f	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
cultures	pathotype	0	HPAI	\N
cultures	pathotype	1	LPAI	\N
cultures	pathotype	2	unidentifiable	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
sequences	segment	0	PB2	\N
sequences	segment	1	PB1	\N
sequences	segment	2	PA	\N
sequences	segment	3	HA	\N
sequences	segment	4	NP	\N
sequences	segment	5	NA	\N
sequences	segment	6	MA	\N
sequences	segment	7	NS	\N
\.

COPY "ac" ( "class", "attr", "ord", "val", "desc" ) FROM stdin;
sera	status	0	+	\N
sera	status	1	-	\N
\.

ALTER DATABASE bfs SET datestyle TO "ISO, DMY";

ALTER SEQUENCE location_id_seq RESTART WITH 22;

CREATE VIEW v_samples_birds_locations AS
  SELECT s.id,
         s.emc_id,
         s.date,
         s.type,
         s.species,
         b.common_name AS bird,
         s.age,
         s.sex,
         s.ring,
         s.clin_st,
         s.vital_st,
         s.tos,
         s.capture_method,
         s.location,
         l.name AS location_name
    FROM samples s
    LEFT OUTER JOIN birds b
      ON b.id = s.species
    LEFT OUTER JOIN locations l
      ON l.id = s.location
;

-- Provide an audit trigger that logs to
-- a dedicated audit table for the major relations.
--
-- This file should be generic and not depend on application roles or structures,
-- as it's being listed here:
--
--    https://wiki.postgresql.org/wiki/Audit_trigger_91plus
--
-- This trigger was originally based on
--   http://wiki.postgresql.org/wiki/Audit_trigger
-- but has been completely rewritten.
--
-- Should really be converted into a relocatable EXTENSION, with control and upgrade files.

CREATE EXTENSION IF NOT EXISTS hstore;

CREATE SCHEMA audit;
-- REVOKE ALL ON SCHEMA audit FROM public;

COMMENT ON SCHEMA audit IS 'Out-of-table audit/history logging tables and trigger functions';

--
-- Audited data. Lots of information is available, it's just a matter of how much
-- you really want to record. See:
--
--   http://www.postgresql.org/docs/9.1/static/functions-info.html
--
-- Remember, every column you add takes up more audit table space and slows audit
-- inserts.
--
-- Every index you add has a big impact too, so avoid adding indexes to the
-- audit table unless you REALLY need them. The hstore GIST indexes are
-- particularly expensive.
--
-- It is sometimes worth copying the audit table, or a coarse subset of it that
-- you're interested in, into a temporary table where you CREATE any useful
-- indexes and do your analysis.
--
CREATE TABLE audit.logged_actions (
    event_id bigserial primary key,
    table_name text not null,
    relid oid not null,
    session_user_name text,
    action_tstamp_stm TIMESTAMP WITH TIME ZONE NOT NULL,
    client_query text,
    action TEXT NOT NULL CHECK (action IN ('I','D','U', 'T')),
    row_data hstore,
    changed_fields hstore,
    statement_only boolean not null
);

REVOKE ALL ON audit.logged_actions FROM public;

COMMENT ON TABLE audit.logged_actions IS 'History of auditable actions on audited tables, from audit.if_modified_func()';
COMMENT ON COLUMN audit.logged_actions.event_id IS 'Unique identifier for each auditable event';
COMMENT ON COLUMN audit.logged_actions.table_name IS 'Non-schema-qualified table name of table event occured in';
COMMENT ON COLUMN audit.logged_actions.relid IS 'Table OID. Changes with drop/create. Get with ''tablename''::regclass';
COMMENT ON COLUMN audit.logged_actions.session_user_name IS 'Login / session user whose statement caused the audited event';
COMMENT ON COLUMN audit.logged_actions.action_tstamp_stm IS 'Statement start timestamp for tx in which audited event occurred';
COMMENT ON COLUMN audit.logged_actions.client_query IS 'Top-level query that caused this auditable event. May be more than one statement.';
COMMENT ON COLUMN audit.logged_actions.action IS 'Action type; I = insert, D = delete, U = update, T = truncate';
COMMENT ON COLUMN audit.logged_actions.row_data IS 'Record value. Null for statement-level trigger. For INSERT this is the new tuple. For DELETE and UPDATE it is the old tuple.';
COMMENT ON COLUMN audit.logged_actions.changed_fields IS 'New values of fields changed by UPDATE. Null except for row-level UPDATE events.';
COMMENT ON COLUMN audit.logged_actions.statement_only IS '''t'' if audit event is from an FOR EACH STATEMENT trigger, ''f'' for FOR EACH ROW';

CREATE INDEX logged_actions_relid_idx ON audit.logged_actions(relid);
CREATE INDEX logged_actions_action_tstamp_tx_stm_idx ON audit.logged_actions(action_tstamp_stm);
CREATE INDEX logged_actions_action_idx ON audit.logged_actions(action);

CREATE OR REPLACE FUNCTION audit.if_modified_func() RETURNS TRIGGER AS $body$
DECLARE
    audit_row audit.logged_actions;
    include_values boolean;
    log_diffs boolean;
    h_old hstore;
    h_new hstore;
    excluded_cols text[] = ARRAY[]::text[];
BEGIN
    IF TG_WHEN != 'AFTER' THEN
        RAISE EXCEPTION 'audit.if_modified_func() may only run as an AFTER trigger';
    END IF;

    audit_row = ROW(
        nextval('audit.logged_actions_event_id_seq'), -- event_id
        TG_TABLE_NAME::text,                          -- table_name
        TG_RELID,                                     -- relation OID for much quicker searches
        session_user::text,                           -- session_user_name
        statement_timestamp(),                        -- action_tstamp_stm
        current_query(),                              -- top-level query or queries (if multistatement) from client
        substring(TG_OP,1,1),                         -- action
        NULL, NULL,                                   -- row_data, changed_fields
        'f'                                           -- statement_only
        );

    IF NOT TG_ARGV[0]::boolean IS DISTINCT FROM 'f'::boolean THEN
        audit_row.client_query = NULL;
    END IF;

    IF TG_ARGV[1] IS NOT NULL THEN
        excluded_cols = TG_ARGV[1]::text[];
    END IF;

    IF (TG_OP = 'UPDATE' AND TG_LEVEL = 'ROW') THEN
        audit_row.row_data = hstore(OLD.*);
        audit_row.changed_fields =  (hstore(NEW.*) - audit_row.row_data) - excluded_cols;
        IF audit_row.changed_fields = hstore('') THEN
            -- All changed fields are ignored. Skip this update.
            RETURN NULL;
        END IF;
    ELSIF (TG_OP = 'DELETE' AND TG_LEVEL = 'ROW') THEN
        audit_row.row_data = hstore(OLD.*) - excluded_cols;
    ELSIF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN
        audit_row.row_data = hstore(NEW.*) - excluded_cols;
    ELSIF (TG_LEVEL = 'STATEMENT' AND TG_OP IN ('INSERT','UPDATE','DELETE','TRUNCATE')) THEN
        audit_row.statement_only = 't';
    ELSE
        RAISE EXCEPTION '[audit.if_modified_func] - Trigger func added as trigger for unhandled case: %, %',TG_OP, TG_LEVEL;
        RETURN NULL;
    END IF;
    INSERT INTO audit.logged_actions VALUES (audit_row.*);
    RETURN NULL;
END;
$body$

LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public;


COMMENT ON FUNCTION audit.if_modified_func() IS $body$
Track changes to a table at the statement and/or row level.

Optional parameters to trigger in CREATE TRIGGER call:

param 0: boolean, whether to log the query text. Default 't'.

param 1: text[], columns to ignore in updates. Default [].

         Updates to ignored cols are omitted from changed_fields.

         Updates with only ignored cols changed are not inserted
         into the audit log.

         Almost all the processing work is still done for updates
         that ignored. If you need to save the load, you need to use
         WHEN clause on the trigger instead.

         No warning or error is issued if ignored_cols contains columns
         that do not exist in the target table. This lets you specify
         a standard set of ignored columns.

There is no parameter to disable logging of values. Add this trigger as
a 'FOR EACH STATEMENT' rather than 'FOR EACH ROW' trigger if you do not
want to log row values.

Note that the user name logged is the login role for the session. The audit trigger
cannot obtain the active role because it is reset by the SECURITY DEFINER invocation
of the audit trigger its self.
$body$;



CREATE OR REPLACE FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) RETURNS void AS $body$
DECLARE
  stm_targets text = 'INSERT OR UPDATE OR DELETE OR TRUNCATE';
  _q_txt text;
  _ignored_cols_snip text = '';
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_row ON ' || target_table;
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_stm ON ' || target_table;

    IF audit_rows THEN
        IF array_length(ignored_cols,1) > 0 THEN
            _ignored_cols_snip = ', ' || quote_literal(ignored_cols);
        END IF;
        _q_txt = 'CREATE TRIGGER audit_trigger_row AFTER INSERT OR UPDATE OR DELETE ON ' ||
                 target_table ||
                 ' FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func(' ||
                 quote_literal(audit_query_text) || _ignored_cols_snip || ');';
        RAISE NOTICE '%',_q_txt;
        EXECUTE _q_txt;
        stm_targets = 'TRUNCATE';
    ELSE
    END IF;

    _q_txt = 'CREATE TRIGGER audit_trigger_stm AFTER ' || stm_targets || ' ON ' ||
             target_table ||
             ' FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('||
             quote_literal(audit_query_text) || ');';
    RAISE NOTICE '%',_q_txt;
    EXECUTE _q_txt;

END;
$body$
language 'plpgsql';

COMMENT ON FUNCTION audit.audit_table(regclass, boolean, boolean, text[]) IS $body$
Add auditing support to a table.

Arguments:
   target_table:     Table name, schema qualified if not on search_path
   audit_rows:       Record each row change, or only audit at a statement level
   audit_query_text: Record the text of the client query that triggered the audit event?
   ignored_cols:     Columns to exclude from update diffs, ignore updates that change only ignored cols.
$body$;

-- Pg doesn't allow variadic calls with 0 params, so provide a wrapper
CREATE OR REPLACE FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean) RETURNS void AS $body$
SELECT audit.audit_table($1, $2, $3, ARRAY[]::text[]);
$body$ LANGUAGE SQL;

-- And provide a convenience call wrapper for the simplest case
-- of row-level logging with no excluded cols and query logging enabled.
--
CREATE OR REPLACE FUNCTION audit.audit_table(target_table regclass) RETURNS void AS $$
SELECT audit.audit_table($1, BOOLEAN 't', BOOLEAN 't');
$$ LANGUAGE 'sql';

COMMENT ON FUNCTION audit.audit_table(regclass) IS $body$
Add auditing support to the given table. Row-level changes will be logged with full client query text. No cols are ignored.
$body$;

SELECT audit.audit_table('samples');
SELECT audit.audit_table('locations');
SELECT audit.audit_table('diagnostics');
SELECT audit.audit_table('sera');

DROP ROLE IF EXISTS visitor;
CREATE USER visitor WITH NOCREATEDB NOCREATEROLE NOCREATEUSER;

DROP ROLE IF EXISTS users;
CREATE USER users WITH NOCREATEDB NOCREATEROLE NOCREATEUSER;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO visitor;
GRANT ALL ON SCHEMA public TO users;
GRANT ALL ON SCHEMA audit TO users;
GRANT ALL ON ALL TABLES IN SCHEMA public TO users;
GRANT ALL ON ALL TABLES IN SCHEMA audit TO users;

DROP ROLE IF EXISTS owner;
CREATE USER owner IN ROLE users;

DROP ROLE IF EXISTS scout;
CREATE USER scout IN ROLE users;

DROP ROLE IF EXISTS labrat;
CREATE USER labrat IN ROLE users;

DROP ROLE IF EXISTS nic;
CREATE USER nic IN ROLE users;

DROP ROLE IF EXISTS zura;
CREATE USER zura IN ROLE users;

DROP ROLE IF EXISTS jimsher;
CREATE USER jimsher IN ROLE users;

DROP ROLE IF EXISTS naira;
CREATE USER naira IN ROLE users;

DROP ROLE IF EXISTS larisa;
CREATE USER larisa IN ROLE users;

CREATE TABLE josanne (
  source text,
  Collecting_Institution text,
  Collection_Date date,
  Receipt_Date date,
  Location text,
  Country text,
  State_Province text,
  Latitude seg,
  Longitude seg,
  Host_Species text,
  Host_Common_Name text,
  Host_Identifier text,
  Capture_Status text,
  Health text,
  Age text,
  Behavior text,
  Sample_Identifier text,
  Sample_Material text,
  Influenza_Test_Type text,
  Influenza_Test_Result text,
  Other_pathogens_tested_for text,
  Other_pathogen_test_result text,
  Habitat text,
  Sex text,
  Host_ID_Type text,
  Sample_Transport_Medium text,
  Strain_Name text
);
  

END TRANSACTION;
