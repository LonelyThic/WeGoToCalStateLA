-- migrate:up
ALTER TABLE users
    ADD COLUMN email_hash VARCHAR(64) NULL AFTER username,
    ADD COLUMN password_hash VARCHAR(255) NULL AFTER email_hash,
    ADD UNIQUE INDEX uq_users_email_hash (email_hash);

-- migrate:down
ALTER TABLE users
    DROP INDEX uq_users_email_hash,
    DROP COLUMN password_hash,
    DROP COLUMN email_hash;