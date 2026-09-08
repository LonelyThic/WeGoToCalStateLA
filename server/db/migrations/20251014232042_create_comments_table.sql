-- migrate:up
CREATE TABLE comments (
    comment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    comment_uuid BINARY(16) UNIQUE NOT NULL,
    parent_comment_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED NOT NULL,
    thread_id BIGINT UNSIGNED NOT NULL,
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    status ENUM('active', 'deleted') NOT NULL DEFAULT 'active',
    CONSTRAINT fk_comments_parent_comment_id FOREIGN KEY (parent_comment_id) REFERENCES comments (comment_id),
    CONSTRAINT fk_comments_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_comments_thread_id FOREIGN KEY (thread_id) REFERENCES threads (thread_id)
);

-- migrate:down
DROP TABLE IF EXISTS comments;