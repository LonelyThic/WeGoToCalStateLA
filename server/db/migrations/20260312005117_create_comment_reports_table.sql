-- migrate:up
CREATE TABLE comment_reports(
    comment_report_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    comment_id BIGINT UNSIGNED NOT NULL,
    UNIQUE (user_id, comment_id),
    report_category_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_reports_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_reports_comments FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_reports_report_categories FOREIGN KEY (report_category_id) REFERENCES report_categories(report_category_id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE IF EXISTS comment_reports;

