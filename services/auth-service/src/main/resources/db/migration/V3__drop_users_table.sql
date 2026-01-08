-- V3: Remove user tables from auth-service (moved to user-service)
-- Drop users table and related indexes (data should be migrated to user-service first)

DROP TABLE IF EXISTS users CASCADE;
