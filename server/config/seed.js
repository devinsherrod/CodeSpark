/**
 * @file seed.js
 * @description
 * Seeds the CodeSpark database with sample coding challenges.
 *
 * Run this script once to populate the database with initial
 * challenge data for development and testing.
 */

const pool = require("./db");

/**
 * Sample coding challenges inserted into the database.
 *
 * @constant {Object[]}
 */
const challenges = [
  {
    title: "Reverse String",
    description: "Write a function that reverses a string. Input: 'hello' -> Output: 'olleh'",
    difficulty: "Easy",
    starter_code: "function reverseString(str) {\n  // your code here\n}",
    expected_output: "olleh",
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

/**
 * Inserts the sample coding challenges into the database.
 *
 * After all records have been inserted, the database connection
 * pool is closed before the script exits.
 *
 * @async
 * @returns {Promise<void>}
 */
async function seed() {
  try {
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
    await pool.end();
  }
}

seed();