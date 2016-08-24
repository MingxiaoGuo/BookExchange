insert into locations (city_name) values ("CHONGQING");
insert into locations (city_name) values ("SHENZHEN");
insert into locations (city_name) values ("SAN JOSE");
insert into locations (city_name) values ("NAPA");
insert into locations (city_name) values ("BROOKYLN");
insert into locations (city_name) values ("QUEENS");
insert into locations (city_name) values ("MANHATTAN");

SELECT * FROM LOCATIONS;
select * from users natural join locations;

SELECT DISTINCT state_name, city_name FROM LOCATIONS;

/*================================================================*/

select * from users;
insert into own_books (book_title, book_condition, book_mongo_id, owner_id) values ("test", "good", "57b560dfbdbb461015c113f6", 1);
insert into own_books (book_title, book_condition, book_mongo_id, owner_id) values ("test2", "excellent", "57b560dfbdbb461015c113f5", 1);
insert into own_books (book_title, book_condition, book_mongo_id, owner_id) values ("test3", "good", "57b560dfbdbb461015cadf113f6", 1);
insert into own_books (book_title, book_condition, book_mongo_id, owner_id) values ("test4", "fair", "57b560dfbdbb461015c113f6", 1);
insert into own_books (book_title, book_condition, book_mongo_id, owner_id) values ("test5", "good", "57b560dfbdbb461015c113f6", 2);
insert into own_books (book_title, book_condition, book_mongo_id, owner_id) values ("test6", "good", "57b560dfbddbb461015c113f6", 2);
insert into own_books (book_title, book_condition, book_mongo_id, owner_id) values ("test7", "good", "57b560dfbsdbb461015c113f6", 2);
insert into own_books (book_title, book_condition, book_mongo_id, owner_id) values ("test8", "good", "57b560dfdbdbb461015c113f6", 2);

select * from own_books;
delete from own_books;
select * from own_books where owner_id = 1;
select * from own_books, users, locations where own_books.owner_id = users.user_id and users.location_id = locations.location_id and lower(book_title) like '%harry%';
select * from want_books;
select * from users, own_books where users.user_id = own_books.owner_id and users.location_id = locations.location_id and book_id = 17;
SELECT TOP 2 * FROM own_books;
 