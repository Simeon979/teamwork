CREATE TABLE IF NOT EXISTS articles (
  article_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_on timestamp NOT NULL DEFAULT NOW(),
  title text NOT NULL,
  article_content text NOT NULL,
  poster_id int NOT NULL REFERENCES employees (employeeid) ON DELETE CASCADE
);
