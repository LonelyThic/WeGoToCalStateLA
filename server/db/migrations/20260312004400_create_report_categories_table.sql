-- migrate:up
CREATE TABLE report_categories(
    report_category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    report_category_name varchar(100) UNIQUE NOT NULL
);

-- migrate:down
DROP TABLE IF EXISTS report_categories;

