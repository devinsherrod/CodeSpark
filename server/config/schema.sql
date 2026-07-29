-- schema.sql
-- Defines the database tables used by the CodeSpark backend.
--
-- Usage:
--   mysql -u root -p codespark_db < config/schema.sql

-- Stores registered CodeSpark users.
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Holds each coding challenge shown on the Challenges/Challenge Detail pages.
CREATE TABLE IF NOT EXISTS challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
  starter_code TEXT,
  expected_output TEXT NOT NULL,
  hint TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Records every time a user submits code for a challenge, and whether it passed.
CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  code TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);