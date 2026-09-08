-- migrate:up
CREATE TABLE thread_reactions(
    thread_reaction_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    thread_id BIGINT UNSIGNED NOT NULL,
    reaction_value ENUM('like', 'dislike') NOT NULL,
    UNIQUE (user_id, thread_id),
    CONSTRAINT fk_thread_reactions_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_thread_reactions_thread_id FOREIGN KEY (thread_id) REFERENCES threads(thread_id)
);

-- migrate:down
DROP TABLE IF EXISTS thread_reactions;

