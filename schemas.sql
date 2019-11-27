-- CREATE DATABASE test;

DROP TABLE question;
DROP TABLE company;
DROP TABLE users;
DROP TABLE category;

CREATE EXTENSION pgcrypto;

CREATE TABLE category(
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    UNIQUE(category, subcategory),
    PRIMARY KEY (category, subcategory)
);

CREATE TABLE users(
    user_id SERIAL,
    email TEXT NOT NULL UNIQUE,
    pwd_hash VARCHAR(60) NOT NULL,
    is_subscribed BOOLEAN NOT NULL,
    category TEXT NOT NULL,
    subcategories TEXT[] NOT NULL, -- Unofficial reference to the category table(every sub_cat must be from the same category)
    PRIMARY KEY(user_id)
);

CREATE TABLE company(
    company TEXT NOT NULL,
    PRIMARY KEY (company)
);

CREATE TABLE question(
    question_id SERIAL,
    title TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    difficulty INTEGER CHECK(difficulty >= 1 AND difficulty <= 5),
    company TEXT NOT NULL REFERENCES company(company) ON DELETE CASCADE,
    rating DECIMAL,
    rating_counter INTEGER,
    FOREIGN KEY (category, subcategory) REFERENCES category(category, subcategory) ON DELETE CASCADE,
    PRIMARY KEY (question_id)
);

INSERT INTO category(category, subcategory) values('computer science', 'arrays');
INSERT INTO category(category, subcategory) values('computer science', 'sets');
INSERT INTO category(category, subcategory) values('computer science', 'hash maps');
INSERT INTO category(category, subcategory) values('computer science', 'graphs');
INSERT INTO category(category, subcategory) values('computer science', 'sorting');

INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test1@gmail.com', crypt('123456', gen_salt('bf', 14)), true, 'computer science', '{"arrays"}');
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test2@gmail.com', crypt('123456', gen_salt('bf', 14)), true, 'computer science', '{"sets", "sorting"}');
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test3@gmail.com', crypt('123456', gen_salt('bf', 14)), true, 'computer science', '{"graphs"}');
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test4@gmail.com', crypt('123456', gen_salt('bf', 14)), true, 'computer science', '{"graphs"}');
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test5@gmail.COM', crypt('123456', gen_salt('bf', 14)), true, 'computer science', '{"graphs"}');
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test6@gmail.com', crypt('123456', gen_salt('bf', 14)), false, 'computer science', '{hash maps}');

INSERT INTO company(company) values('regular');

INSERT INTO question(title, category, subcategory, difficulty, company, rating, rating_counter) 
            values('Implement quicksort', 'computer science', 'sorting', 1, 'regular', 3, 1);
INSERT INTO question(title, category, subcategory, difficulty, company, rating, rating_counter) 
            values('Implement merge sort', 'computer science', 'sorting', 1, 'regular', 3.5, 2);
INSERT INTO question(title, category, subcategory, difficulty, company, rating, rating_counter) 
            values('Insert into a BST', 'computer science', 'graphs', 1, 'regular', 3, 2);
INSERT INTO question(title, category, subcategory, difficulty, company, rating, rating_counter) 
            values('Implement isBST', 'computer science', 'graphs', 1, 'regular', 4, 3);
INSERT INTO question(title, category, subcategory, difficulty, company, rating, rating_counter) 
            values('Check anagram', 'computer science', 'hash maps', 1, 'regular', 3, 2);
INSERT INTO question(title, category, subcategory, difficulty, company, rating, rating_counter) 
            values('Check palindrome', 'computer science', 'arrays', 1, 'regular', 3.3, 10);
-- :::NO SQL::: --

-- question:
--     key: q_id:
--         question_text (raw text)

-- history:
--     key: user_id:
--         q_id (raw text)
--         rating_score (int)

-- answers:
--     key: q_id:
--         question_answer (raw text)