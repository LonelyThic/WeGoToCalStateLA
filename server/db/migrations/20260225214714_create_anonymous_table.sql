-- migrate:up
CREATE TABLE anonymous_name (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL UNIQUE,
    anonymous_name VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT fk_anonymous_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
-- migrate:down
DROP TABLE IF EXISTS anonymous_name;

