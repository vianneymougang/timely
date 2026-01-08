-- Create password_reset_tokens table
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on token for faster lookup
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);

-- Create index on user_id for faster lookup
CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);

-- Create index on expiry_date to clean up expired tokens
CREATE INDEX idx_password_reset_expiry ON password_reset_tokens(expiry_date);
