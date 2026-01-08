-- V4: Update refresh_tokens table to use userId instead of foreign key
-- Remove foreign key constraint and update user_id column

ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS fk_refresh_token_user;
-- user_id column already exists from previous schema
