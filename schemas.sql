CREATE DATABASE test;

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
    -- company_id SERIAL,
    company TEXT NOT NULL,
    -- PRIMARY KEY (company_id)
    PRIMARY KEY (company)
);

CREATE TABLE question(
    question_id SERIAL,
    title TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    difficulty INTEGER CHECK(difficulty >= 1 AND difficulty <= 5),
    company INTEGER REFERENCES company(company) ON DELETE CASCADE,
    rating DECIMAL,
    rating_counter INTEGER,
    FOREIGN KEY (category, subcategory) REFERENCES category(category, subcategory) ON DELETE CASCADE,
    PRIMARY KEY (question_id)
);

INSERT INTO category(category, subcategory) values(lower('Computer Science'), lower('Arrays'));
INSERT INTO category(category, subcategory) values(lower('Computer Science'), lower('Sets'));
INSERT INTO category(category, subcategory) values(lower('Computer Science'), lower('Hash Maps'));
INSERT INTO category(category, subcategory) values(lower('Computer Science'), lower('Graphs'));
INSERT INTO category(category, subcategory) values(lower('Computer Science'), lower('Sorting'));

INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values(lower('tEst1@gmail.com'), crypt('123456', gen_salt('bf', 14)), true, lower('Computer Science'), lower('{"Arrays"}'));
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values(lower('TEst2@gmail.com'), crypt('123456', gen_salt('bf', 14)), true, lower('Computer Science'), lower('{"Sets", "Sorting"}'));
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values(lower('test3@gmail.com'), crypt('123456', gen_salt('bf', 14)), true, lower('Computer Science'), lower('{"Graphs"}'));
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values(lower('test4@gMail.com'), crypt('123456', gen_salt('bf', 14)), true, lower('Computer Science'), lower('{"Graphs"}'));
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values(lower('TEST5@GMAIL.COM'), crypt('123456', gen_salt('bf', 14)), true, lower('Computer Science'), lower('{"Graphs"}'));
INSERT INTO users(email, pwd_hash, is_subscribed, category, subcategories) values(lower('test6@gmail.com'), crypt('123456', gen_salt('bf', 14)), false, lower('Computer Science'), lower('{"Hash Maps"}'));

INSERT INTO company(company) values(lower('Regular'));

INSERT INTO question(title, category, subcategory, difficulty, company_id, rating, rating_counter) 
            values('Implement quicksort', lower('Computer Science'), lower('Sorting'), 1, 1, 3, 1);
INSERT INTO question(title, category, subcategory, difficulty, company_id, rating, rating_counter) 
            values('Implement merge sort', lower('Computer Science'), lower('Sorting'), 1, 1, 3.5, 2);
INSERT INTO question(title, category, subcategory, difficulty, company_id, rating, rating_counter) 
            values('Insert into a BST', lower('Computer Science'), lower('Graphs'), 1, 1, 3, 2);
INSERT INTO question(title, category, subcategory, difficulty, company_id, rating, rating_counter) 
            values('Implement isBST', lower('Computer Science'), lower('Graphs'), 1, 1, 4, 3);
INSERT INTO question(title, category, subcategory, difficulty, company_id, rating, rating_counter) 
            values('Check anagram', lower('Computer Science'), lower('Hash Maps'), 1, 1, 3, 2);
INSERT INTO question(title, category, subcategory, difficulty, company_id, rating, rating_counter) 
            values('Check palindrome', lower('Computer Science'), lower('Arrays'), 1, 1, 3.3, 10);
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