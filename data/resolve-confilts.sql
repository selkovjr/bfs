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
   AND j_samples.id IN (SELECT id FROM samples);

UPDATE j_samples SET species = '31051' WHERE species = '2990' AND j_samples.id IN (SELECT id FROM samples);

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
   AND j_samples.id IN (SELECT id FROM samples);

UPDATE j_samples SET species = '31027' WHERE species = '462' AND j_samples.id IN (SELECT id FROM samples);

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
   AND j_samples.id IN (SELECT id FROM samples);

UPDATE j_samples SET species = '3101' WHERE species = '32105' AND j_samples.id IN (SELECT id FROM samples);


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
   AND j_samples.id IN (SELECT id FROM samples);

UPDATE j_samples SET species = '304' WHERE species = '-4' AND j_samples.id IN (SELECT id FROM samples);

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
   AND j_samples.id IN (SELECT id FROM samples);

UPDATE j_samples SET species = '373' WHERE species = '-3' AND j_samples.id IN (SELECT id FROM samples);

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
   AND j_samples.id IN (SELECT id FROM samples);

UPDATE j_samples SET species = '435' WHERE species = '-2' AND j_samples.id IN (SELECT id FROM samples);

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
   AND j_samples.id IN (SELECT id FROM samples);

UPDATE j_samples SET species = '31641' WHERE species = '5783' AND j_samples.id IN (SELECT id FROM samples);

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
   AND j_samples.id IN (SELECT id FROM samples);

UPDATE j_samples SET species = '31675' WHERE species = '3227' AND j_samples.id IN (SELECT id FROM samples);

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
   AND j_samples.id IN (SELECT id FROM samples);

UPDATE j_samples SET species = '3000' WHERE species = '2989' AND j_samples.id IN (SELECT id FROM samples);

END TRANSACTION;
