-- migrate:up
CREATE table events(
    event_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    event_uuid BINARY(16) NOT NULL UNIQUE,
    address_id BIGINT UNSIGNED NOT NULL,
    event_title varchar(255) NOT NULL,
    event_description TEXT NOT NULL,
    started_at TIMESTAMP NOT NULL ,
    ended_at TIMESTAMP NOT NULL ,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_events_address_id FOREIGN KEY (address_id) REFERENCES addresses (address_id),
    CONSTRAINT chk_event_ended_after_started CHECK ( ended_at > started_at )
);

-- migrate:down

DROP TABLE IF EXISTS events;

