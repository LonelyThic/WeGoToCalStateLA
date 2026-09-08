-- migrate:up
CREATE TABLE permissions(
    permission_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    permission_name varchar(64) NOT NULL UNIQUE,
    permission_description varchar(500) NOT NULL,
    created_at NOT NULL TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at NOT NULL TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

)

-- migrate:down
DROP TABLE IF EXISTS permissions;
