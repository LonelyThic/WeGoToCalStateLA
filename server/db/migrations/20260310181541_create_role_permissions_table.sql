-- migrate:up

CREATE TABLE role_permissions(
    role_id INT UNSIGNED NOT NULL,
    permission_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    created_at NOT NULL TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role_permissions_role_id
       FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE ,
    CONSTRAINT fk_role_permissions_permission_id
       FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE IF EXISTSrole_permissions;