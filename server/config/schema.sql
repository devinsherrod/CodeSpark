-- schema.sql
-- Defines the two tables the M2 backend needs. Run this once against a
-- fresh codespark_db database to create the tables before seeding data.
--
-- Usage:
--   mysql -u root -p codespark_db < config/schema.sql

-- Holds each coding challenge shown on the Challenges/Challenge Detail pages.
CREATE TABLE IF NOT EXISTS challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
  starter_code TEXT,              -- pre-filled code shown in the editor textarea
  expected_output TEXT NOT NULL,  -- used by the placeholder pass/fail check in submissions.js
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Records every time a user submits code for a challenge, and whether it passed.
CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,     -- no users table / auth yet, so this is just a plain int for now
  code TEXT NOT NULL,       -- the code the user submitted
  passed BOOLEAN NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);
