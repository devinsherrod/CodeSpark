// seed.js
// One-time script that inserts sample challenge data into the database
// so the API has something real to return. Run with: npm run seed
//
// The 3 challenges here match the placeholder names already shown in
// the frontend (src/pages/Challenges.jsx): Reverse String, FizzBuzz,
// Two Sum — so if someone wires up fetch() calls on the frontend later,
// the names will already line up with what's on screen.

const pool = require("./db");

const challenges = [
  {
    title: "Reverse String",
    description: "Write a function that reverses a string. Input: 'hello' -> Output: 'olleh'",
    difficulty: "Easy",
    starter_code: "function reverseString(str) {\n  // your code here\n}",
    expected_output: "olleh", // what our naive pass/fail check looks for in the submission
    hint: "Try splitting the string into an array of characters, reversing that array, then joining it back together.",
  },
  {
    title: "FizzBuzz",
    description:
      "Print numbers 1 to 15. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', for multiples of both print 'FizzBuzz'.",
    difficulty: "Easy",
    starter_code: "function fizzBuzz() {\n  // your code here\n}",
    expected_output: "1,2,Fizz,4,Buzz,Fizz,7,8,Fizz,Buzz,11,Fizz,13,14,FizzBuzz",
    hint: "Use the modulo operator (%) to check divisibility. Check for 'divisible by both 3 and 5' before checking each one individually.",
  },
  {
    title: "Two Sum",
    description:
      "Given an array of integers and a target, return the indices of the two numbers that add up to the target. Input: [2,7,11,15], target=9 -> Output: [0,1]",
    difficulty: "Medium",
    starter_code: "function twoSum(nums, target) {\n  // your code here\n}",
    expected_output: "[0,1]",
    hint: "A brute-force double loop works, but think about using an object/map to store numbers you've already seen so you can check for the complement in one pass.",
  },
];

async function seed() {
  try {
    // Loop through each challenge and insert it as its own row.
    // Using ? placeholders (not string concatenation) to avoid SQL injection,
    // same pattern as the route files.
    for (const c of challenges) {
      await pool.query(
        "INSERT INTO challenges (title, description, difficulty, starter_code, expected_output, hint) VALUES (?, ?, ?, ?, ?, ?)",
        [c.title, c.description, c.difficulty, c.starter_code, c.expected_output, c.hint]
      );
    }
    console.log(`Seeded ${challenges.length} challenges.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    // Close the pool's connections when done so the script actually exits
    // instead of hanging (a running pool keeps the Node process alive).
    await pool.end();
  }
}

seed();
