-- migrate:up
CREATE TABLE ban_records(
    ban_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    target_user_id BIGINT UNSIGNED NOT NULL,
    issued_by_user_id BIGINT UNSIGNED NOT NULL,
    ban_reason varchar(400) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expired_at TIMESTAMP,
    CONSTRAINT fk_ban_records_target_user_id FOREIGN KEY (target_user_id)
        REFERENCES users(user_id),
    CONSTRAINT fk_ban_records_issued_by_user_id FOREIGN KEY (issued_by_user_id)
        REFERENCES users(user_id),
    CONSTRAINT chk_ban_ended_after_started CHECK (expired_at IS NULL OR expired_at > started_at)
);

-- migrate:down
DROP TABLE IF EXISTS ban_records;

