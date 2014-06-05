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

## Extracting tables from Josanne's spreadsheet

```bash
cut -f 1-27 131128_NicolaLewis-2.tab | ./add27 | ./fix-unknown-date | ./shift-dates > josanne.tab
./import-josannes-spreaadsheet josanne.tab
```

Tables will be created in the current directory. Examine `josanne-reject.tab` for the
elements not processed by the import script. Note that this table's column
header is at its tail:

```bash
tail josanne-reject.tab
```

## Loading tables into the database

```bash
psql bfs < load_tables.sql
```
To load the raw form of Josanne's spreadsheet:

```bash
tail -n +2 josanne.tab | psql bfs -c '\copy josanne from STDIN'
```

To load parsed tables from Josanne's spreadsheet:

```sql
DROP TABLE j_samples;
SELECT * INTO j_samples FROM samples LIMIT 0;
\copy j_samples from josanne-samples.tab

DROP TABLE j_diagnostics;
SELECT * INTO j_diagnostics FROM diagnostics LIMIT 0;
\copy j_diagnostics from josanne-diagnostics.tab
```

## Finding non-ASCII characters in files:

```bash
cat NFB-DB_SpecList_final.tab | tr -s '[[:punct:][:space:]]' '\n' | perl -nE'say if/[\x80-\xFF]/' | sort -u
```

## Merge conflicts

### In the samples table

#### date

```sql
SELECT s."date", j."date" FROM samples s, j_samples j WHERE s.id = j.id AND s."date" <> j."date";
```
Perfect match.

#### species

1. Some mismatches or ambiguities may be due to mapping rules. They need to be
   reviewed. The rules that only apply to Josanne’s file are at the top of the
   list, separated by a blank line — they don’t match anything in the old EMC
   file.

   ```perl
    elsif ($key eq 'species') {
      my $text = lc $f[$column{'Host_Species'}];

      # Josanne only
      $text = 'larus cachinnans' if $text eq 'larus cachinnans cachinnans';
      $text = 'larus genei' if $text eq 'chroicocephalus genei';
      $text = 'larus argentatus' if $text eq 'larus argentatus cachinnans';
      $text = 'sterna caspia' if $text eq 'hydroprogne caspia';  # this should be reversed
      $text = 'chlidonias hybrida' if $text eq 'chlidonias hybridus';
      $text = 'alcedo atthis' if $text eq 'alcedinidae';
      $text = 'anser cygnoides' if $text eq 'anser sp'; # they are all domestic geese in this spreadsheet
      $text = 'anas platyrhynchos' if $text eq 'anas sp'; # they are all domestic ducks in this spreadsheet
      $text = 'corvus corone' if $text eq 'corvus corone cornix';
      $text = 'eudromias morinellus' if $text eq 'charadrius morinellus';  # probably should be reversed

      # Josanne and old EMC spreadsheet
      $text = 'cattle egret' if $text eq 'western cattle egret';
      $text = 'common moorhen' if $text eq 'moorhen';
      $text = 'eurasian blackbird' if $text eq 'blackbird';
      $text = 'eurasian woodcock' if $text eq 'woodcock';
      $text = 'european bee-eater' if $text eq 'bee-eater';
      $text = 'greater white-fronted Goose' if $text eq 'white-fronted goose';
      #$text = 'mallard' if $text eq 'domestic duck';
      # 'domestic duck' needs to be kept this way; a few more domestic birds
      # have now been added to taxonomy
      $text = 'northern pintail' if $text eq 'pintail';
      $text = 'northern shoveler' if $text eq 'shoveler';
      $text = 'red-throated loon' if $text eq 'red-throated diver';
      $text = 'swan goose' if $text eq 'goose';
      if ( $text eq '\n' or $text eq 'domestic' ) {
        push @fields, '\N';
      }
      elsif ( $id = $birdByCommonName{lc $text} ) {
        push @fields, $id;
      }
      elsif ( $id = $birdByName{lc $text} ) {
        push @fields, $id;
      }
    }
    ```
2. Conflict summary

    ```sql
SELECT count(*), s.species AS s, j.species AS j, b1.name AS "s.name", b2.name AS "j.name" FROM samples s, j_samples j, birds b1, birds b2 WHERE s.id = j.id AND b1.id = s.species AND b2.id = j.species AND s.species <> j.species GROUP BY s, j, "s.name", "j.name";
    ```
    ```bash
 count |   s   |   j   |        s.name         |        j.name
-------+-------+-------+-----------------------+-----------------------
    26 | 31051 |  2990 | Gallinago gallinago   | Gallinago gallinago
     4 |   304 |    -4 | Meleagris gallopavo   | Meleagris gallopavo
     1 | 31641 |  5783 | Corvus cornix         | Corvus corone
   133 | 31675 |  3227 | Larus michahellis     | Larus argentatus
    10 |   373 |    -3 | Anser cygnoides       | Anser cygnoides
    14 |  3000 |  2989 | Lymnocryptes minimus  | Gallinago media
    22 | 31027 |   462 | Anas crecca           | Anas crecca
    20 |  3101 | 32105 | Himantopus himantopus | Himantopus himantopus
   664 |   435 |    -2 | Anas platyrhynchos    | Anas platyrhynchos
(9 rows)
    ```

#### sex
```sql
SELECT s.sex, j.sex FROM samples s, j_samples j WHERE s.id = j.id AND NOT (s.sex IS NULL AND j.sex = 'U') AND s.sex <> j.sex;
```
This query shows a perfect match except for `U` in Josanne's set corresponding
to NULL in the earlier EMC set.

We have later decided to replace all `U`'s with NULLs and now there is a
perfect match.

