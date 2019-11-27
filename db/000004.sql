CREATE TABLE IF NOT EXISTS article_comments (
  comment_id int PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  comment text NOT NULL,
  created_on timestamp NOT NULL DEFAULT NOW(),
  article_id int NOT NULL REFERENCES articles (article_id) ON DELETE CASCADE,
  poster_id int NOT NULL REFERENCES employees (employeeid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gif_comments (
  comment_id int PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  comment text NOT NULL,
  created_on timestamp NOT NULL DEFAULT NOW(),
  gif_id int NOT NULL REFERENCES uploaded_gifs (gif_id) ON DELETE CASCADE,
  poster_id int NOT NULL REFERENCES employees (employeeid) ON DELETE CASCADE
);
