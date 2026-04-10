ALTER TABLE filieres
    ADD COLUMN IF NOT EXISTS cycle_type VARCHAR(30);

UPDATE filieres SET cycle_type = 'LICENCE' WHERE cycle_type IS NULL;

ALTER TABLE filieres
    ALTER COLUMN cycle_type SET NOT NULL;

ALTER TABLE classes
    ADD COLUMN IF NOT EXISTS year_index INTEGER;

UPDATE classes c
SET year_index = CASE c.niveau
    WHEN 'L1' THEN 1
    WHEN 'L2' THEN 2
    WHEN 'L3' THEN 3
    WHEN 'M1' THEN 1
    WHEN 'M2' THEN 2
    ELSE 1
END
WHERE c.year_index IS NULL;

ALTER TABLE classes
    ALTER COLUMN year_index SET NOT NULL;

ALTER TABLE classes DROP COLUMN IF EXISTS niveau;
