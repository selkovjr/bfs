# BFS data

## Bird taxonomy

  Species codes used in the NEW-FLUBIRD database (contains 11048 entries)

  Last update: 2008-06-10

```
  ./extract-birds NFB-DB_SpecList_final.tab > birds.tab
```

## Extracting tables from the Erasmus spreadsheet

```bash
./import-emc-spreaadsheet 101005_results_to_Nicola_Georgia_cohort217_2010.tab
```

Tables will be created in the current directory. Examine `reject.tab` for the
elements not processed by the import script. Note that this table's column
header is at its tail:

```bash
tail reject.tab
```

## Loading tables into the database

```bash
psql bfs < load_tables.sql
```
To load the raw form of Josanne's spreadsheet:

```bash
cut -f 1-27 131128_NicolaLewis-2.tab | ./add27 | ./fix-unknown-date | ./shift-dates > josanne.tab
tail -n +2 josanne.tab | psql bfs -c '\copy josanne from STDIN'
```

To load parsed tables from Josanne's spreadsheet:

```sql
DROP TABLE j_samples;
SELECT * INTO j_samples FROM samples LIMIT 0;
\copy j_samples from josanne-samples.tab
```

## Finding non-ASCII characters in files:

```bash
cat NFB-DB_SpecList_final.tab | tr -s '[[:punct:][:space:]]' '\n' | perl -nE'say if/[\x80-\xFF]/' | sort -u
```

## Merge conflicts

### Sex
```sql
SELECT s.sex, j.sex FROM samples s, j_samples j WHERE s.id = j.id AND NOT (s.sex IS NULL AND j.sex = 'U') AND s.sex <> j.sex;
```
This query shows a perfect match except for `U` in Josanne's set corresponding
to NULL in the earlier EMC set.

