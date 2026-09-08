-- migrate:up
CREATE TABLE threads (
    thread_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    thread_uuid BINARY(16) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    status ENUM('active', 'deleted') NOT NULL DEFAULT 'active',
    CONSTRAINT fk_threads_user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- migrate:down
DROP TABLE IF EXISTS threads;