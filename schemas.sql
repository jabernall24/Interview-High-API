CREATE DATABASE test;

DROP TABLE questions;
DROP TABLE groups;
DROP TABLE users;
DROP TABLE category;

CREATE TABLE category(
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    UNIQUE(category, subcategory),
    PRIMARY KEY (category, subcategory)
);

CREATE TABLE users(
    user_id SERIAL,
    email TEXT NOT NULL UNIQUE,
    pwd_hash TEXT NOT NULL,
    is_subscribed BOOLEAN NOT NULL,
    category TEXT NOT NULL,
    subcategories TEXT[] NOT NULL, -- Unofficial reference to the category table(every sub_cat must be from the same category)
    PRIMARY KEY(user_id)
);

CREATE TABLE groups(
    group_id SERIAL,
    company TEXT NOT NULL UNIQUE,
    PRIMARY KEY (group_id)
);

CREATE TABLE questions(
    question_id SERIAL,
    title TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    difficulty INTEGER CHECK(difficulty >= 1 AND difficulty <= 5),
    group_id INTEGER REFERENCES groups(group_id) ON DELETE CASCADE,
    rating DECIMAL,
    rating_counter INTEGER,
    FOREIGN KEY (category, subcategory) REFERENCES category(category, subcategory) ON DELETE CASCADE,
    PRIMARY KEY (question_id)
);

INSERT INTO category(category, subcategory) values('Computer Science', 'Arrays');
INSERT INTO category(category, subcategory) values('Computer Science', 'Sets');
INSERT INTO category(category, subcategory) values('Computer Science', 'Hash Maps');
INSERT INTO category(category, subcategory) values('Computer Science', 'Graphs');
INSERT INTO category(category, subcategory) values('Computer Science', 'Sorting');

INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test1@gmail.com', '123456', true, 'Computer Science', '{"Arrays"}');
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test2@gmail.com', '123456', true, 'Computer Science', '{"Sets", "Sorting"}');
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test3@gmail.com', '123456', true, 'Computer Science', '{"Graphs"}');
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test4@gmail.com', '123456', true, 'Computer Science', '{"Graphs"}');
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test5@gmail.com', '123456', true, 'Computer Science', '{"Graphs"}');
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values('test6@gmail.com', '123456', false, 'Computer Science', '{"Hash Maps"}');

INSERT INTO groups(company) values('Regular');

INSERT INTO questions(title, category, subcategory, difficulty, group_id, rating, rating_counter) 
            values('Implement quicksort', 'Computer Science', 'Sorting', 1, 1, 3, 1);
INSERT INTO questions(title, category, subcategory, difficulty, group_id, rating, rating_counter) 
            values('Implement merge sort', 'Computer Science', 'Sorting', 1, 1, 3.5, 2);
INSERT INTO questions(title, category, subcategory, difficulty, group_id, rating, rating_counter) 
            values('Insert into a BST', 'Computer Science', 'Graphs', 1, 1, 3, 2);
INSERT INTO questions(title, category, subcategory, difficulty, group_id, rating, rating_counter) 
            values('Implement isBST', 'Computer Science', 'Graphs', 1, 1, 4, 3);
INSERT INTO questions(title, category, subcategory, difficulty, group_id, rating, rating_counter) 
            values('Check anagram', 'Computer Science', 'Hash Maps', 1, 1, 3, 2);
INSERT INTO questions(title, category, subcategory, difficulty, group_id, rating, rating_counter) 
            values('Check palindrome', 'Computer Science', 'Arrays', 1, 1, 3.3, 10);
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