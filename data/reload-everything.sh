#!/bin/bash
dropdb bfs
createdb bfs
cd ../schema/
psql bfs < bfs-schema.sql
cd ../data/
psql bfs < load_tables.sql
tail -n +2 josanne.tab | psql bfs -c '\copy josanne from STDIN'
psql bfs < samples_and_diagnostics_from_josanne.sql
psql bfs -c 'INSERT INTO samples SELECT * FROM j_samples WHERE id NOT IN (SELECT id FROM samples);'
