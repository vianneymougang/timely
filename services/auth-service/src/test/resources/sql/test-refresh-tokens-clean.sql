-- Clean refresh tokens table before each test
-- Ensures test isolation

DELETE FROM refresh_tokens WHERE user_id IS NOT NULL;
