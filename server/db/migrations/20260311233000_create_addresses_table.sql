-- migrate:up
CREATE TABLE addresses(
    address_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    street varchar(255) NOT NULL ,
    address2 varchar(255)  ,
    city varchar(100) NOT NULL ,
    state varchar(100) NOT NULL ,
    zip_code varchar(20) NOT NULL ,
    country varchar(100) NOT NULL
);

-- migrate:down
DROP TABLE IF EXISTS addresses
