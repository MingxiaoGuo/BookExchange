create database book;
DROP TABLE IF EXISTS `own_books`;
DROP TABLE IF EXISTS `want_books`;
DROP TABLE users;
DROP TABLE locations;

show tables;

create table locations (
	location_id int(11) NOT NULL AUTO_INCREMENT primary key,
    city_name varchar(100) not null unique
);

create table users (
	user_id int(11)  NOT NULL AUTO_INCREMENT primary key,
    user_email varchar(100) not null unique,
    user_password varchar(200) not null,
    user_name varchar(100) not null,
    location_id int(11) not null,
    user_phone varchar(10),
    full_address varchar(300),
    FOREIGN KEY (location_id) REFERENCES locations (location_id)
);

create table own_books (
	book_id int(11) NOT NULL AUTO_INCREMENT primary key,
    book_title varchar(100) NOT NULL,
    owner_id int(11),
    book_condition varchar(50),
    book_mongo_id varchar(100),
    FOREIGN KEY (owner_id) REFERENCES users (user_id) ON DELETE SET NULL ON UPDATE CASCADE
);

create table want_books (
	book_id int(11) NOT NULL AUTO_INCREMENT primary key,
    book_title varchar(100) NOT NULL unique,
    user_id int(11),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL ON UPDATE CASCADE
);

SET SQL_SAFE_UPDATES = 0;

select * from users;
delete from users;
