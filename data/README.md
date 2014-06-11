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

 * Some mismatches or ambiguities may be due to mapping rules. They need to be
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
 * Duplicate phylogeny entries can cause mismatches or spurious matches

   ```
   SELECT * FROM (SELECT count(*), name FROM birds GROUP BY name ORDER BY count DESC, name ASC) AS multiple WHERE count > 1;
   ```


 * Conflict summary

    ```sql
SELECT count(*), s.species AS s, j.species AS j, b1.name AS "s.name", b2.name AS "j.name" FROM samples s, j_samples j, birds b1, birds b2 WHERE s.id = j.id AND b1.id = s.species AND b2.id = j.species AND s.species <> j.species GROUP BY s, j, "s.name", "j.name";
    ```
     count |   s   |   j   |        s.name         |        j.name
    ------:|------:|------:|:----------------------|:----------------------
        26 | 31051 |  2990 | Gallinago gallinago   | Gallinago gallinago
         4 |   304 |    -4 | Meleagris gallopavo   | Meleagris gallopavo
         1 | 31641 |  5783 | Corvus cornix         | Corvus corone
       133 | 31675 |  3227 | Larus michahellis     | Larus argentatus
        10 |   373 |    -3 | Anser cygnoides       | Anser cygnoides
        14 |  3000 |  2989 | Lymnocryptes minimus  | Gallinago media
        22 | 31027 |   462 | Anas crecca           | Anas crecca
        20 |  3101 | 32105 | Himantopus himantopus | Himantopus himantopus
       664 |   435 |    -2 | Anas platyrhynchos    | Anas platyrhynchos

 * *Gallinago gallinago, Anas crecca, Himantopus himantopus* -- the absence of common names

    ```sql
    SELECT * FROM birds WHERE name = 'Gallinago gallinago';
    ```
      id   |    family    |   genus   |  species  |        name         | common_name
    ------:|--------------|-----------|-----------|---------------------|--------------
     31051 | Scolopacidae | Gallinago | gallinago | Gallinago gallinago | Common Snipe
      2990 | Scolopacidae | Gallinago | gallinago | Gallinago gallinago |

    ```sql
    SELECT * FROM birds WHERE name = 'Anas crecca';
    ```
      id   |  family  | genus | species |    name     | common_name
    ------:|----------|-------|---------|-------------|-------------
     31027 | Anatidae | Anas  | crecca  | Anas crecca | Common Teal
       462 | Anatidae | Anas  | crecca  | Anas crecca |

    ```sql
    SELECT * FROM birds WHERE name = 'Himantopus himantopus';
    ```
      id   |      family      |   genus    |  species   |         name          |    common_name
    ------:|------------------|------------|------------|-----------------------|--------------------
      3101 | Recurvirostridae | Himantopus | himantopus | Himantopus himantopus | Black-winged Stilt
     32105 | Recurvirostridae | Himantopus | himantopus | Himantopus himantopus |

    That is strange. Systematic names are supposed to be unique. It looks
    like the birds were matched by common name in the old spreadsheet but in
    the absence of it the first instance of the systematic name was picked.

    **Solution: pick the variants that include common names**

    In: `resolve-confilts.sql`

    > Review!

 * *Meleagris gallopavo, Anser cygnoides, Anas platyrhynchos* -- wild or domestic?

    ```sql
    SELECT * FROM birds WHERE name = 'Meleagris gallopavo';
    ```
     id  |   family    |   genus   |  species  |        name         |   common_name
    ----:|-------------|-----------|-----------|---------------------|-----------------
      -4 | Phasianidae | Meleagris | gallopavo | Meleagris gallopavo | Domestic Turkey
     304 | Phasianidae | Meleagris | gallopavo | Meleagris gallopavo | Wild Turkey

    ```sql
    SELECT * FROM birds WHERE name = 'Anser cygnoides';
    ```
     id  |  family  | genus |  species  |      name       |  common_name
    ----:|----------|-------|-----------|-----------------|----------------
      -3 | Anatidae | Anser | cygnoides | Anser cygnoides | Domestic Goose
     373 | Anatidae | Anser | cygnoides | Anser cygnoides | Swan Goose

    ```sql
    SELECT * FROM birds WHERE name = 'Anas platyrhynchos';
    ```
     id  |  family  | genus |    species    |        name        |  common_name
    ----:|----------|-------|---------------|--------------------|---------------
      -2 | Anatidae | Anas  | platyrhynchos | Anas platyrhynchos | Domestic Duck
     435 | Anatidae | Anas  | platyrhynchos | Anas platyrhynchos | Mallard

     **Solution: prefer wild to domestic**

     In: `resolve-confilts.sql`

     > Review!

 * *Corvus cornix|Corvus corone, Larus michahellis|Larus argentatus, Lymnocryptes minimus|Gallinago media* -- species mismatch

    ```sql
    SELECT * FROM birds WHERE name ~ 'Corvus cornix|Corvus corone';
    ```

      id   |  family  | genus  | species |     name      | common_name
    ------:|----------|--------|---------|---------------|--------------
      5783 | Corvidae | Corvus | corone  | Corvus corone | Carrion Crow
     31641 | Corvidae | Corvus | cornix  | Corvus cornix | Hooded Crow

    ```sql
    SELECT * FROM birds WHERE name ~ 'Larus michahellis|Larus argentatus';
    ```
      id   | family  | genus |   species   |       name        |    common_name
    ------:|---------|-------|-------------|-------------------|--------------------
      3227 | Laridae | Larus | argentatus  | Larus argentatus  | Herring Gull
     31675 | Laridae | Larus | michahellis | Larus michahellis | Yellow-legged Gull

    ```sql
    SELECT * FROM birds WHERE name ~ 'Lymnocryptes minimus|Gallinago media';
    ```
      id  |    family    |    genus     | species |         name         | common_name
    -----:|--------------|--------------|---------|----------------------|-------------
     2989 | Scolopacidae | Gallinago    | media   | Gallinago media      | Great Snipe
     3000 | Scolopacidae | Lymnocryptes | minimus | Lymnocryptes minimus | Jack Snipe

     **Solution: prefer the old EMC version**

     In: `resolve-confilts.sql`

    > Review!

#### age

  * With age, we found that Josanne’s categories do not map to those we adopted, so we decided to leave them as they are. But within the merge zone, we are going to override them and so it is interesting to see how they correspond where we have versions of the same record.

    Most of the records in the merge have the (adult, A) pair, and I filtered those out as tentatively matching. There are a couple dozen (juvenile, J) pairings, and I left them in because we also have (juvenile, H). Here’s the remainder that is left after the (adult, A) are removed:

    ```sql
    SELECT s.id, s.age AS "s.age", j.age AS "j.age" FROM samples s, j_samples j WHERE s.id = j.id AND NOT ((s.age IS NULL AND j.age = 'U') OR (s.age = 'adult' AND j.age = 'A'));
    ```
        id    |  s.age   | j.age
    ---------:|---------:|-------
     217-1825 | adult    | U
     217-1828 | adult    | U
     217-1831 | adult    | U
     217-1839 | adult    | U
     217-1841 | adult    | U
     217-1842 | adult    | U
     217-1843 | adult    | U
     217-1844 | adult    | U
     217-1845 | adult    | U
     217-1846 | adult    | U
     217-1847 | adult    | U
     217-1848 | adult    | U
     217-1623 | juvenile | J
     217-1626 | juvenile | J
     217-1627 | juvenile | J
     217-1628 | juvenile | J
     217-1629 | juvenile | J
     217-1630 | juvenile | J
     217-1631 | juvenile | J
     217-1632 | juvenile | J
     217-1634 | juvenile | J
     217-1636 | juvenile | J
     217-1637 | juvenile | J
     217-1638 | juvenile | J
     217-1640 | juvenile | J
     217-1641 | juvenile | J
     217-1643 | juvenile | J
     217-1644 | juvenile | J
     217-1645 | juvenile | J
     217-1647 | juvenile | J
     217-1656 | juvenile | J
     217-1657 | juvenile | J
     217-1661 | juvenile | J
     217-1663 | juvenile | J
     217-1877 | juvenile | J
     217-2310 | juvenile | J
     217-1    | juvenile | H
     217-8    | juvenile | H
     217-318  | juvenile | H
     217-363  | juvenile | H
     217-430  | juvenile | H
     217-684  | juvenile | H
     217-685  | juvenile | H

     **Solution: override U -> adult, H -> juvenile; assume J is juvenile**

     In: `resolve-confilts.sql`

#### sex
```sql
SELECT s.sex, j.sex FROM samples s, j_samples j WHERE s.id = j.id AND NOT (s.sex IS NULL AND j.sex = 'U') AND s.sex <> j.sex;
```
This query shows a perfect match except for `U` in Josanne's set corresponding
to NULL in the earlier EMC set.

We have later decided to replace all `U`'s with NULLs and now there is a
perfect match.

### Diagnostics

#### rec_date

```sql
SELECT d.sample, d.rec_date, j.* FROM diagnostics d, j_diagnostics j WHERE j.sample = d.sample AND d.rec_date <> j.rec_date;
```
sample  |  rec_date  | sample  |  rec_date  | date | pool | ma_status | ma_ct | h5_status | h5_ct | h5_pt | h7_status | h7_ct | h7_pt | h9_status | h9_ct | ndv_status | ndv_ct
---------|------------|---------|------------|------|------|-----------|-------|-----------|-------|-------|-----------|-------|-------|-----------|-------|------------|--------
217-586 | 2010-02-18 | 217-586 | 2006-02-17 |      |      | -         |       |           |       |       |           |       |       |           |       |            |
217-587 | 2010-02-18 | 217-587 | 2006-02-17 |      |      | -         |       |           |       |       |           |       |       |           |       |            |
217-588 | 2010-02-18 | 217-588 | 2006-02-17 |      |      | -         |       |           |       |       |           |       |       |           |       |            |

Broken date; no useful data; discard these records.

There are no other records with broken dates.

The rest of the data in Josanne's table is a subset of the of old EMC set with matching IDs. It is safe to merge the non-matching records.

```sql
SELECT d.sample, d.ma_status, j.* FROM diagnostics d, j_diagnostics j WHERE j.sample = d.sample AND d.ma_status <> j.ma_status;
```


## Merging

```sql
INSERT INTO samples SELECT * FROM j_samples WHERE id NOT IN (SELECT id FROM samples);
INSERT INTO diagnostics SELECT * FROM j_diagnostics WHERE sample NOT IN (SELECT sample FROM diagnostics);
```


