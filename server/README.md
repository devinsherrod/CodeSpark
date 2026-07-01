# CodeSpark Server (M2)

Backend API for challenge display and code submission checking.

## Setup

```bash
cd server
npm install
cp .env.example .env    # then fill in your local MySQL password
```

Create the database and load the schema:

```bash
mysql -u root -p -e "CREATE DATABASE codespark_db"
mysql -u root -p codespark_db < config/schema.sql
```

Seed sample challenges (Reverse String, FizzBuzz, Two Sum):

```bash
npm run seed
```

Run the server:

```bash
npm start
```

Server runs on `http://localhost:5050` by default (change `PORT` in `.env` if needed).

## Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/challenges` | List all challenges (id, title, difficulty) |
| GET | `/api/challenges/:id` | Full detail for one challenge |
| POST | `/api/submissions` | Submit code for a challenge. Body: `{ challengeId, userId, code }` |
| GET | `/api/submissions/:userId` | All submissions for a given user |

### Example: POST /api/submissions

Request body:
```json
{ "challengeId": 1, "userId": 1, "code": "function reverseString(str) { return str.split('').reverse().join(''); } // olleh" }
```

Response:
```json
{ "submissionId": 4, "passed": true }
```

## Known limitations (M2 scope)

- **No real code execution.** Submitted code isn't actually run — `passed` is determined by checking whether the submission text contains the challenge's expected output. Real sandboxed execution is a stretch goal for a later milestone.
- **No auth on these routes.** `userId` is just passed in the request body for now since M1 auth isn't wired into this repo yet.
