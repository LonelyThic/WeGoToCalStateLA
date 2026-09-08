-- migrate:up

CREATE TABLE comment_reactions(
    comment_reaction_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    comment_id BIGINT UNSIGNED NOT NULL,
    reaction_value ENUM('like', 'dislike') NOT NULL,
    UNIQUE (user_id, comment_id),
    CONSTRAINT fk_comment_reactions_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_comment_reactions_comment_id FOREIGN KEY (comment_id) REFERENCES comments(comment_id)
);

-- migrate:down
DROP TABLE IF EXISTS comment_reactions;
