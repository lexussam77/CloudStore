INSERT INTO users (
    id,
    user_id,
    first_name,
    last_name,
    email,
    phone,
    bio,
    reference_id,
    image_url,
    created_by,
    updated_by,
    created_at,
    update_at,
    account_non_expired,
    account_non_locked,
    enabled,
    mfa,
    password
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
             '$2a$10$7QJ8QwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw' -- password: password
         );

INSERT INTO roles (id, name, authorities) VALUES (1, 'USER', null);
INSERT INTO roles (id, name, authorities) VALUES (2, 'ADMIN', null);

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
