-- V2: Create user_code_sequence table for auto-generating matricules
DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                       WHERE table_schema = 'public' AND table_name = 'user_code_sequence') THEN
            CREATE TABLE user_code_sequence (
                                                id BIGSERIAL PRIMARY KEY,
                                                sequence_type VARCHAR(50) NOT NULL UNIQUE,
                                                current_value BIGINT NOT NULL DEFAULT 0,
                                                version BIGINT DEFAULT 0
            );
        END IF;
    END$$;

-- Insert initial sequences only if they don't exist
INSERT INTO user_code_sequence (sequence_type, current_value, version)
SELECT 'TEACHER', 0, 0
WHERE NOT EXISTS (
    SELECT 1 FROM user_code_sequence WHERE sequence_type = 'TEACHER'
);

INSERT INTO user_code_sequence (sequence_type, current_value, version)
SELECT 'ADMIN', 0, 0
WHERE NOT EXISTS (
    SELECT 1 FROM user_code_sequence WHERE sequence_type = 'ADMIN'
);

-- Fix telephone_number column type from INTEGER to BIGINT
ALTER TABLE users
    ALTER COLUMN telephone_number TYPE BIGINT;

-- Add BLOCKED status to the users table check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_status;

ALTER TABLE users ADD CONSTRAINT chk_status
    CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED'));
