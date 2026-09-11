-- migrate:up
CREATE TABLE thread_reports(
    thread_report_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    thread_id BIGINT UNSIGNED NOT NULL,
    UNIQUE (user_id, thread_id),
    report_category_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_thread_reports_user_id FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_thread_reports_thread_id FOREIGN KEY (thread_id) REFERENCES threads(thread_id),
    CONSTRAINT fk_thread_reports_report_category_id FOREIGN KEY (report_category_id) REFERENCES report_categories(report_category_id)
);

-- migrate:down
DROP TABLE IF EXISTS thread_reports;