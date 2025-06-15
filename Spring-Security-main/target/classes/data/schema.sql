SET search_path TO public;

-- Drop tables if they exist (for dev/test only)
DROP TABLE IF EXISTS confirmations CASCADE;
DROP TABLE IF EXISTS credential CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    authorities VARCHAR(255),
    reference_id VARCHAR(255),
    created_by BIGINT NOT NULL,
    updated_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    update_at TIMESTAMP NOT NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    reference_id VARCHAR(255),
    image_url TEXT,
    created_by BIGINT NOT NULL,
    updated_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    update_at TIMESTAMP NOT NULL,
    account_non_expired BOOLEAN DEFAULT TRUE,
    account_non_locked BOOLEAN DEFAULT TRUE,
    enabled BOOLEAN DEFAULT TRUE,
    mfa BOOLEAN DEFAULT FALSE,
    login_attempts INTEGER,
    last_login TIMESTAMP,
    qr_code_secret TEXT,
    qr_code_image_uri TEXT,
    password VARCHAR(255) NOT NULL
);

-- User-Roles join table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Credential table
CREATE TABLE credential (
    id BIGSERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL UNIQUE,
    reference_id VARCHAR(255),
    created_by BIGINT NOT NULL,
    updated_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    update_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Confirmations table
CREATE TABLE confirmations (
    id BIGSERIAL PRIMARY KEY,
    confirmation_key VARCHAR(255),
    user_id BIGINT NOT NULL UNIQUE,
    reference_id VARCHAR(255),
    created_by BIGINT NOT NULL,
    updated_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    update_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ensure USER role exists
INSERT INTO roles (id, name, authorities, reference_id, created_by, updated_by, created_at, update_at)
SELECT 1, 'USER', null, 'ref1', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'USER');

-- Insert test user
INSERT INTO users (
    id, user_id, first_name, last_name, email, phone, bio, reference_id, image_url,
    created_by, updated_by, created_at, update_at, account_non_expired, account_non_locked,
    enabled, mfa, login_attempts, last_login, qr_code_secret, qr_code_image_uri, password
) VALUES (
    1,
    '123e4567-e89b-12d3-a456-426614174000',
    'John',
    'Doe',
    'john.doe@example.com',
    '9876543210',
    'Sample bio text.',
    'abcd1234-5678-90ef-ghij-1234567890kl',
    'https://example.com/profile_image.png',
    1,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    true,
    true,
    true,
    false,
    0,
    CURRENT_TIMESTAMP,
    null,
    null,
    '$2a$10$7QJ8QwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQw' -- password: password
);

-- Assign USER role to test user
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
