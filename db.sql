use node_js;
SELECT EXISTS(SELECT id FROM users WHERE email="seb@mail.com");

CREATE Table if not exists users(

id int UNSIGNED AUTO_INCREMENT,
user_name VARCHAR(30) NOT NULL,
user_firstName VARCHAR(30) NOT NULL,
email VARCHAR(50) not null UNIQUE,
user_password VARCHAR(128) not NULL,
photo VARCHAR(80),
bio TEXT,
PRIMARY KEY (id)

);


INSERT INTO users (`user_name`,`user_firstName`,`email`,`user_password`)
VALUES
('Seb','Roger', 'seb@mail.com', '$2b$04$sUu6pzV8bcfW3dotEABxp.BvEZWifd36kTyizmHnTRsTcsZh2QqNa'),
('Seve','Albert', 'sev@mail.com', '$2b$04$sUu6pzV8bcfW3dotEABxp.BvEZWifd36kTyizmHnTRsTcsZh2QqNa'),
('Maev','Lataupe', 'maev@mail.com', '$2b$04$sUu6pzV8bcfW3dotEABxp.BvEZWifd36kTyizmHnTRsTcsZh2QqNa'),
('Alice','Gaborit', 'alice@mail.com', '$2b$04$sUu6pzV8bcfW3dotEABxp.BvEZWifd36kTyizmHnTRsTcsZh2QqNa');