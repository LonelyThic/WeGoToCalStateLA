-- migrate:up
CREATE TABLE users (
    user_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_uuid BINARY(16) NOT NULL UNIQUE,
    username varchar(100) Not NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- migrate:down
DROP TABLE IF EXISTS users;