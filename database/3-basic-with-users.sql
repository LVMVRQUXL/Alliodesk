-- Database tables

DROP TABLE IF EXISTS "User_status" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Service_status" CASCADE;
DROP TABLE IF EXISTS "Service" CASCADE;
DROP TABLE IF EXISTS "Error" CASCADE;
DROP TABLE IF EXISTS "Feedback" CASCADE;
DROP TABLE IF EXISTS "Workspace" CASCADE;
DROP TABLE IF EXISTS "User_has_Service" CASCADE;
DROP TABLE IF EXISTS "Workspace_contains_Service" CASCADE;

-- Tables creation

CREATE TABLE "User_status"
(
    id     SERIAL PRIMARY KEY,
    status VARCHAR(255) NOT NULL
);

CREATE TABLE "User"
(
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    email          VARCHAR(255) NOT NULL,
    login          VARCHAR(255) NOT NULL UNIQUE,
    password       VARCHAR(255) NOT NULL,
    token_session  VARCHAR(255) UNIQUE,
    user_status_id INT          NOT NULL,

    FOREIGN KEY (user_status_id) REFERENCES "User_status" (id)
);

CREATE TABLE "Service_status"
(
    id     SERIAL PRIMARY KEY,
    status VARCHAR(255) NOT NULL
);

CREATE TABLE "Service"
(
    id                 SERIAL PRIMARY KEY,
    name               VARCHAR(255) NOT NULL UNIQUE,
    version            VARCHAR(255),
    source_url         VARCHAR(255) NOT NULL,
    update_config_link VARCHAR(255),
    user_id            INT          NOT NULL,
    service_status_id  INT          NOT NULL,

    FOREIGN KEY (user_id) REFERENCES "User" (id),
    FOREIGN KEY (service_status_id) REFERENCES "Service_status" (id)
);

CREATE TABLE "Error"
(
    id         SERIAL PRIMARY KEY,
    message    VARCHAR(255) NOT NULL,
    user_id    INT          NOT NULL,
    service_id INT,

    FOREIGN KEY (user_id) REFERENCES "User" (id),
    FOREIGN KEY (service_id) REFERENCES "Service" (id)
);

CREATE TABLE "Feedback"
(
    id          SERIAL PRIMARY KEY,
    score       INT          NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    user_id     INT          NOT NULL,
    service_id  INT          NOT NULL,

    FOREIGN KEY (user_id) REFERENCES "User" (id),
    FOREIGN KEY (service_id) REFERENCES "Service" (id)
);

CREATE TABLE "Workspace"
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    user_id     INT          NOT NULL,

    FOREIGN KEY (user_id) REFERENCES "User" (id)
);

-- Join tables creation

CREATE TABLE "User_has_Service"
(
    user_id    INT,
    service_id INT,

    PRIMARY KEY (user_id, service_id),

    FOREIGN KEY (user_id) REFERENCES "User" (id),
    FOREIGN KEY (service_id) REFERENCES "Service" (id)
);

CREATE TABLE "Workspace_contains_Service"
(
    workspace_id INT,
    service_id   INT,

    PRIMARY KEY (workspace_id, service_id),

    FOREIGN KEY (workspace_id) REFERENCES "Workspace" (id),
    FOREIGN KEY (service_id) REFERENCES "Service" (id)
);

-- Values insertion

INSERT INTO "User_status"(status)
VALUES ('admin'),
       ('user');

INSERT INTO "Service_status"(status)
VALUES ('validated'),
       ('pending'),
       ('rejected');

INSERT INTO "User"(name, email, login, password, user_status_id)
VALUES ('testAdmin',
        'test_admin@gmail.com',
        'admin54321',
        'dbe9787aaf4002c6662e490b3f1f7512807459b6dee2e1c2e56738e1cbbd993c', -- hash of '1234admin'
        1),
       ('test',
        'test@gmail.com',
        'test12345',
        '90e2cd6afaf9cdef6eb243188c6d09247658dfc06feb2ca784c67a4220bbd4e4', -- hash of '1234test'
        2);
