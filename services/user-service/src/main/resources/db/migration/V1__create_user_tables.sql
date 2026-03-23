-- V1: Create users table with SINGLE_TABLE inheritance
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone_number INTEGER,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    creation_date DATE,
    
    -- Teacher-specific fields
    matricule VARCHAR(255),
    grade VARCHAR(255),
    rank VARCHAR(255),
    hourly_rate VARCHAR(255),
    
    -- Admin-specific fields
    access_level INTEGER,
    department INTEGER,
    
    CONSTRAINT chk_user_type CHECK (user_type IN ('TEACHER', 'ADMIN')),
    CONSTRAINT chk_role CHECK (role IN ('ROLE_TEACHER', 'ROLE_ADMIN')),
    CONSTRAINT chk_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_teachers_matricule ON users(matricule) WHERE user_type = 'TEACHER';
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Insert a default admin user (password: password - BCrypt hash)
-- Note: This is for development only. In production, change this password immediately
INSERT INTO users (id, user_type, name, surname, email, password, role, status, creation_date, access_level, department)
VALUES (
    uuid_generate_v4(),
    'ADMIN',
    'Super',
    'Admin',
    'admin@timely.com',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',  -- password
    'ROLE_ADMIN',
    'ACTIVE',
    CURRENT_DATE,
    3,
    1
);
