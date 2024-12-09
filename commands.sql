CREATE TABLE blogs(
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes int DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Karol Ascot Obrzut', 'https://www.gog.com/blog/diablo/', 'Diablo');
INSERT INTO blogs (author, url, title) VALUES ('Arthur Dejardin', 'https://www.gog.com/blog/the-gog-preservation-program/', 'The GOG Preservation Program Makes Games Live Forever');
