CREATE TABLE IF NOT EXISTS articles (
  article_id text NOT NULL PRIMARY KEY,
  created_on timestamp NOT NULL DEFAULT NOW(),
  title text NOT NULL,
  article_content text NOT NULL,
  uploader_id int NOT NULL REFERENCES employees (employeeid)
);
