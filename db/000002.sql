CREATE TABLE IF NOT EXISTS uploaded_gifs (
  gif_id text NOT NULL PRIMARY KEY,
  created_on timestamp NOT NULL DEFAULT NOW(),
  title text NOT NULL,
  image_url text NOT NULL,
  uploader_id int NOT NULL REFERENCES employees (employeeid)
);
