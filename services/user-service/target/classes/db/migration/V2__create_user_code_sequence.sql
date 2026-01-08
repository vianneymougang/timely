-- V2: Create user_code_sequence table for auto-generating matricules
CREATE TABLE user_code_sequence (
                                    id BIGSERIAL PRIMARY KEY,
                                    sequence_type VARCHAR(50) NOT NULL UNIQUE,
                                    current_value BIGINT NOT NULL DEFAULT 0,
                                    version BIGINT DEFAULT 0
);

-- Insert initial sequences
INSERT INTO user_code_sequence (sequence_type, current_value, version) VALUES ('TEACHER', 0, 0);
INSERT INTO user_code_sequence (sequence_type, current_value, version) VALUES ('ADMIN', 0, 0);

-- Fix telephone_number column type from INTEGER to BIGINT
ALTER TABLE users ALTER COLUMN telephone_number TYPE BIGINT;

-- Add BLOCKED status to the users table check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_status;
ALTER TABLE users ADD CONSTRAINT chk_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED'));
