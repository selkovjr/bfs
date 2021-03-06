BEGIN TRANSACTION;
-- 1. Species

-- 1.1 Prefer variants having common names

-- Gallinago gallinago
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'species',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s id of 2990: Gallinago galinago / NULL -> Gallinago gallinago / Common Snipe'
  FROM j_samples
 WHERE species = '2990'
   AND j_samples.id IN (SELECT id FROM samples WHERE species = '31051');

-- inconsequential; will be overriden in the merge; here just to check whether
-- conflict resulution was successful
UPDATE j_samples SET species = '31051' WHERE species = '2990' AND j_samples.id IN (SELECT id FROM samples WHERE species = '31051');

-- Anas crecca
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'species',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s id of 462: Anas crecca / NULL -> Anas crecca / Common Teal'
  FROM j_samples
 WHERE species = '462'
   AND j_samples.id IN (SELECT id FROM samples WHERE species = '31027');

UPDATE j_samples SET species = '31027' WHERE species = '462' AND j_samples.id IN (SELECT id FROM samples WHERE species = '31027');

-- Himantopus himantopus
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'species',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s id of 32105: Himantopus himantopus / NULL -> Himantopus himantopus / Common Snipe'
  FROM j_samples
 WHERE species = '32105'
   AND j_samples.id IN (SELECT id FROM samples WHERE species = '3101');

UPDATE j_samples SET species = '3101' WHERE species = '32105' AND j_samples.id IN (SELECT id FROM samples WHERE species = '3101');


-- 1.2 Prefer wild to domestic

-- Meleagris gallopavo
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'species',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s id of -4: Meleagris gallopavo / Domestic Turkey -> Meleagris gallopavo / Wild Turkey'
  FROM j_samples
 WHERE species = '-4'
   AND j_samples.id IN (SELECT id FROM samples WHERE species = '304');

UPDATE j_samples SET species = '304' WHERE species = '-4' AND j_samples.id IN (SELECT id FROM samples WHERE species = '304');

-- Anser cygnoides
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'species',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s id of -3: Anser cygnoides / Domestic Goose -> Anser cygnoides / Swan Goose'
  FROM j_samples
 WHERE species = '-3'
   AND j_samples.id IN (SELECT id FROM samples WHERE species = '373');

UPDATE j_samples SET species = '373' WHERE species = '-3' AND j_samples.id IN (SELECT id FROM samples WHERE species = '373');

-- Anas platyrhynchos
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'species',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s id of -2: Anas platyrhynchos / Domestic Duck -> Anas platyrhynchos / Mallard'
  FROM j_samples
 WHERE species = '-2'
   AND j_samples.id IN (SELECT id FROM samples WHERE species = '435');

UPDATE j_samples SET species = '435' WHERE species = '-2' AND j_samples.id IN (SELECT id FROM samples WHERE species = '435');

-- 1.3 Prefer the old EMC version to Josanne's

-- Corvus cornix / Corvus corone
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'species',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s id of 5783: Corvus corone -> Corvus cornix'
  FROM j_samples
 WHERE species = '5783'
   AND j_samples.id IN (SELECT id FROM samples WHERE species = '31641');

UPDATE j_samples SET species = '31641' WHERE species = '5783' AND j_samples.id IN (SELECT id FROM samples WHERE species = '31641');

-- Larus michahellis / Larus argentatus
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'species',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s id of 3227: Larus argentatus -> Larus michahellis'
  FROM j_samples
 WHERE species = '3227'
   AND j_samples.id IN (SELECT id FROM samples WHERE species = '31675');

UPDATE j_samples SET species = '31675' WHERE species = '3227' AND j_samples.id IN (SELECT id FROM samples WHERE species = '31675');

-- Lymnocryptes minimus / Gallinago media'
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'species',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s id of 2989: Lymnocryptes minimus -> Gallinago media'
  FROM j_samples
 WHERE species = '2989'
   AND j_samples.id IN (SELECT id FROM samples WHERE species = '3000');

UPDATE j_samples SET species = '3000' WHERE species = '2989' AND j_samples.id IN (SELECT id FROM samples WHERE species = '3000');


-- 2. Age

-- U -> adult
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'age',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s age: U -> adult'
  FROM j_samples
 WHERE j_samples.id IN ('217-1825', '217-1828', '217-1831', '217-1839', '217-1841', '217-1842', '217-1843', '217-1844', '217-1845', '217-1846', '217-1847', '217-1848');

UPDATE j_samples SET age = 'adult'
 WHERE j_samples.id IN ('217-1825', '217-1828', '217-1831', '217-1839', '217-1841', '217-1842', '217-1843', '217-1844', '217-1845', '217-1846', '217-1847', '217-1848');


-- H -> juvenile
INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'age',
    'selkovjr',
    'now',
    'merge conflict; overrode Josanne''s age: H -> juvenile'
  FROM j_samples
 WHERE j_samples.id IN ('217-318', '217-1', '217-8', '217-363', '217-430', '217-684', '217-685');

UPDATE j_samples SET age = 'juvenile'
 WHERE j_samples.id IN ('217-318', '217-1', '217-8', '217-363', '217-430', '217-684', '217-685');


-- 3. Location

INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'location',
    'selkovjr',
    'now',
    'merge conflict; overrode earlier -1 (village) with Josanne''s 3 (Grigoleti)'
  FROM j_samples
 WHERE j_samples.id IN ('217-1996', '217-1997', '217-1998', '217-1999', '217-2001', '217-2002', '217-2003', '217-2004', '217-2005', '217-2006', '217-2007', '217-2008', '217-2009', '217-2010', '217-2013', '217-2014', '217-2015', '217-2016', '217-2017', '217-2018', '217-2019', '217-2020', '217-2023', '217-2025', '217-2026', '217-2027');

UPDATE samples SET location = '3'
 WHERE samples.id IN ('217-1996', '217-1997', '217-1998', '217-1999', '217-2001', '217-2002', '217-2003', '217-2004', '217-2005', '217-2006', '217-2007', '217-2008', '217-2009', '217-2010', '217-2013', '217-2014', '217-2015', '217-2016', '217-2017', '217-2018', '217-2019', '217-2020', '217-2023', '217-2025', '217-2026', '217-2027');


INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'location',
    'selkovjr',
    'now',
    'merge conflict; overrode earlier -1 (village) with Josanne''s 6 (Chorokhi Delta)'
  FROM j_samples
 WHERE j_samples.id IN ('217-2028', '217-2029');

UPDATE samples SET location = '6'
 WHERE samples.id IN ('217-2028', '217-2029');

-- 4. Duplicate keys in Josanne's table

COPY notes (class, id, attr, "user", "when", text) FROM stdin;
samples	217-267	id	selkovjr	2014-06-11 04:09:38	Merge conflict: duplicate keys in Josanne''s table, 217-267-a and 217-267-b. Date conflict. Neither record was merged. Suggest merging with 217-267-a (emc_id = '2010_1_00098'), discarding 217-267-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-267.html">See the diff of the duplicates</a>.
samples	217-267-a	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-267. The other duplicate is 217-267-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-267.html">See the diff of the duplicates</a>.
samples	217-267-b	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-267. The other duplicate is 217-267-a. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-267.html">See the diff of the duplicates</a>.
samples	217-355	id	selkovjr	2014-06-11 04:09:38	Merge conflict: duplicate keys in Josanne''s table, 217-355-a and 217-355-b. Species conflict. Neither record was merged. Suggest merging with 217-355-a (emc_id = '2010_1_00186'), discarding 217-355-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-355.html">See the diff of the duplicates</a>.
samples	217-355-a	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-355. The other duplicate is 217-355-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-355.html">See the diff of the duplicates</a>.
samples	217-355-b	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-355. The other duplicate is 217-355-a. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-355.html">See the diff of the duplicates</a>.
samples	217-506	id	selkovjr	2014-06-11 04:09:38	Merge conflict: duplicate keys in Josanne''s table, 217-506-a and 217-506-b. Josanne''s species (herring gull) does not agree with the older EMC spreadsheet (yellow-legged gull). Neither record was merged. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-506.html">See the diff of the duplicates</a>.
samples	217-506-a	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-506. The other duplicate is 217-506-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-506.html">See the diff of the duplicates</a>.
samples	217-506-b	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-506. The other duplicate is 217-506-a. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-506.html">See the diff of the duplicates</a>.
samples	217-507	id	selkovjr	2014-06-11 04:09:38	Merge conflict: duplicate keys in Josanne''s table, 217-507-a and 217-507-b. Josanne''s species (herring gull) does not agree with the older EMC spreadsheet (yellow-legged gull). Neither record was merged. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-507.html">See the diff of the duplicates</a>.
samples	217-507-a	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-507. The other duplicate is 217-507-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-507.html">See the diff of the duplicates</a>.
samples	217-507-b	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-507. The other duplicate is 217-507-a. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-507.html">See the diff of the duplicates</a>.
samples	217-1404	id	selkovjr	2014-06-11 04:09:38	Merge conflict: duplicate keys in Josanne''s table, 217-1404-a and 217-1404-b. Neither record was merged. Suggest discarding 217-1404-a and 217-1404-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-1404.html">See the diff of the duplicates</a>.
samples	217-1404-a	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-1404. The other duplicate is 217-1404-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-1404.html">See the diff of the duplicates</a>.
samples	217-1404-b	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-1404. The other duplicate is 217-1404-a. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-1404.html">See the diff of the duplicates</a>.
samples	217-1609	id	selkovjr	2014-06-11 04:09:38	Merge conflict: duplicate keys in Josanne''s table, 217-1609-a and 217-1609-b. Neither record was merged. Suggest discarding 217-1609-a and 217-1609-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-1609.html">See the diff of the duplicates</a>.
samples	217-1609-a	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-1609. The other duplicate is 217-1609-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-1609.html">See the diff of the duplicates</a>.
samples	217-1609-b	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-1609. The other duplicate is 217-1609-a. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-1404.html">See the diff of the duplicates</a>.
samples	217-2091	id	selkovjr	2014-06-11 04:09:38	Merge conflict: duplicate keys in Josanne''s table, 217-2091-a and 217-2091-b. Neither record was merged. Suggest discarding 217-2091-a and 217-2091-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-2091.html">See the diff of the duplicates</a>.
samples	217-2091-a	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-2091. The other duplicate is 217-2091-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-2091.html">See the diff of the duplicates</a>.
samples	217-2091-b	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-2091. The other duplicate is 217-2091-a. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-2091.html">See the diff of the duplicates</a>.
samples	217-2103	id	selkovjr	2014-06-11 04:09:38	Merge conflict: duplicate keys in Josanne''s table, 217-2103-a and 217-2103-b. Neither record was merged. Suggest discarding 217-2103-a and 217-2103-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-2103.html">See the diff of the duplicates</a>.
samples	217-2103-a	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-2103. The other duplicate is 217-2103-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-2103.html">See the diff of the duplicates</a>.
samples	217-2103-b	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-2103. The other duplicate is 217-2103-a. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-2103.html">See the diff of the duplicates</a>.
samples	217-2107	id	selkovjr	2014-06-11 04:09:38	Merge conflict: duplicate keys in Josanne''s table, 217-2107-a and 217-2107-b. Neither record was merged. Suggest discarding 217-2107-a and 217-2107-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-2107.html">See the diff of the duplicates</a>.
samples	217-2107-a	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-2107. The other duplicate is 217-2107-b. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-2107.html">See the diff of the duplicates</a>.
samples	217-2107-b	id	selkovjr	2014-06-11 04:14:22	Merge conflict. This is one of the pair of duplicate keys in Josanne''s table to be merged with 217-2107. The other duplicate is 217-2107-a. <a href="https://rawgit.com/selkovjr/bfs/master/data/diff-217-2107.html">See the diff of the duplicates</a>.
\.

-- Duplicate IDs

INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'id',
    'selkovjr',
    'now',
    'Duplicate ID (one of 4). Search for <code>id ~ ''^217-2618-[a-d]$''</code> to see all'
  FROM samples
  WHERE regexp_replace(id, '-?[a-z]$', '') = '217-2618';

INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'id',
    'selkovjr',
    'now',
    'Duplicate ID (one of 3). Search for <code>id ~ ''' || regexp_replace(id, '-?[a-z]$', '') || '-?[a-d]$''</code> to see all'
  FROM samples
  WHERE regexp_replace(id, '-?[a-z]$', '') IN (
    SELECT key from (SELECT count(*), regexp_replace(id, '-?[a-z]$', '') AS key FROM j_samples GROUP BY key ORDER BY count DESC) AS multiple WHERE count = 3
  );

INSERT INTO notes (class, id, attr, "user", "when", text)
  SELECT
    'samples',
    id,
    'id',
    'selkovjr',
    'now',
    'Duplicate ID (one of 2). Search for <code>id ~ ''' || regexp_replace(id, '-?[a-z]$', '') || '-?[a-d]$''</code> to see all'
  FROM samples
  WHERE regexp_replace(id, '-?[a-z]$', '') IN (
    SELECT key from (SELECT count(*), regexp_replace(id, '-?[a-z]$', '') AS key FROM j_samples GROUP BY key ORDER BY count DESC) AS multiple WHERE count = 2
  );

END TRANSACTION;
