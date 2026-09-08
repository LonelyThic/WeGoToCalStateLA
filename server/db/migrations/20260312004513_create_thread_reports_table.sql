-- migrate:up
CREATE TABLE comment_reports(
    comment_report_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    comment_id BIGINT UNSIGNED NOT NULL,
    UNIQUE (user_id, comment_id),
    report_category_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_reports_user_id FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_comment_reports_comment_id FOREIGN KEY (comment_id) REFERENCES comments(comment_id),
    CONSTRAINT fk_comment_reports_report_category_id FOREIGN KEY (report_category_id) REFERENCES report_categories(report_category_id)
);

-- migrate:down
DROP TABLE IF EXISTS comment_reports;



