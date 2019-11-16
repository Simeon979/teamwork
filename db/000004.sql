CREATE TABLE IF NOT EXISTS article_comments (
  comment text NOT NULL,
  created_on timestamp NOT NULL DEFAULT NOW(),
  article_id text NOT NULL REFERENCES articles (article_id) ON DELETE CASCADE,
  poster_id int NOT NULL REFERENCES employees (employeeid)
)

CREATE TABLE IF NOT EXISTS gif_comments (
  comment text NOT NULL,
  created_on timestamp NOT NULL DEFAULT NOW(),
  gif_id text NOT NULL REFERENCES uploaded_gifs (gif_id) ON DELETE CASCADE,
  poster_id int NOT NULL REFERENCES employees (employeeid)
)