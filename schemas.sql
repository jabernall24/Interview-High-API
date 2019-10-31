:::SQL:::
User:
    Id: Int
    email: varchar
    password: varchar
    q_category: varchar (foriegn key from category)

questions:
    q_id: Int
    category: varchar (import from category)
    sub: varhar (import from category)
    difficulty: Int
    grouping: int (import from grouping)
    rating: float (function of rating_counter)

category:
    category: varchar
    sub_cat: varchar

grouping:
    id: int
    company: varchar (unique)


:::NO SQL:::

question:
    key: q_id:
        question_text (raw text)

history:
    key: user_id:
        q_id (raw text)
        rating_score (int)

answers:
    key: q_id:
        question_answer (raw text)