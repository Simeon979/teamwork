CREATE TABLE IF NOT EXISTS uploaded_gifs (
  gif_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_on timestamp NOT NULL DEFAULT NOW(),
  title text NOT NULL,
  image_url text NOT NULL,
  uploader_id int NOT NULL REFERENCES employees (employeeid) ON DELETE CASCADE
);
