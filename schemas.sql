CREATE DATABASE test;

CREATE TABLE category(
    cat TEXT NOT NULL UNIQUE,
    sub_cat TEXT NOT NULL UNIQUE,
    PRIMARY KEY (cat, sub_cat)
);

CREATE TABLE users(
    id SERIAL UNIQUE,
    email TEXT NOT NULL,
    pass TEXT NOT NULL,
    q_cat TEXT REFERENCES category(cat) ON DELETE CASCADE,
    PRIMARY KEY(id)
);

CREATE TABLE groups(
    id SMALLINT,
    company TEXT UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE questions(
    id SMALLINT,
    category TEXT REFERENCES category(cat) ON DELETE CASCADE,
    sub_cat TEXT REFERENCES category(sub_cat) ON DELETE CASCADE,
    difficulty INTEGER,
    groups INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    rating DECIMAL,
    rating_counter INTEGER,
    PRIMARY KEY (id)
);

INSERT INTO category(cat, sub_cat) values('Computer Science', 'Arrays');
INSERT INTO category(cat, sub_cat) values('Computer Science', 'Sets');
INSERT INTO category(cat, sub_cat) values('Computer Science', 'Hash Maps');
INSERT INTO category(cat, sub_cat) values('Computer Science', 'Graphs');
INSERT INTO category(cat, sub_cat) values('Computer Science', 'Recursion');

INSERT INTO users(email, pass, cat) values('jabernall24@gmail.com', 'fuckidk', 'Computer Science');
INSERT INTO users(email, pass, cat) values('mikemenendez@gmail.com', 'lkasjef', 'Computer Science');

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