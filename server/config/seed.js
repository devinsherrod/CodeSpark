/**
 * @file seed.js
 * @description
 * Seeds the CodeSpark database with sample coding challenges.
 *
 * Run this script to populate the database with development
 * and testing challenge data.
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
    description:
      "Write a function that reverses a string. Input: 'hello' -> Output: 'olleh'",
    difficulty: "Easy",
    starter_code:
      "function reverseString(str) {\n  // your code here\n}",
    expected_output: "olleh",
    hint: "Try splitting the string into an array of characters, reversing that array, then joining it back together.",
  },
  {
    title: "FizzBuzz",
    description:
      "Print numbers 1 to 15. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', for multiples of both print 'FizzBuzz'.",
    difficulty: "Easy",
    starter_code: "function fizzBuzz() {\n  // your code here\n}",
    expected_output:
      "1,2,Fizz,4,Buzz,Fizz,7,8,Fizz,Buzz,11,Fizz,13,14,FizzBuzz",
    hint: "Use the modulo operator (%) to check divisibility. Check for divisibility by both 3 and 5 first.",
  },
  {
    title: "Two Sum",
    description:
      "Given an array of integers and a target, return the indices of the two numbers that add up to the target. Input: [2,7,11,15], target=9 -> Output: [0,1]",
    difficulty: "Medium",
    starter_code:
      "function twoSum(nums, target) {\n  // your code here\n}",
    expected_output: "[0,1]",
    hint: "Use an object or Map to store numbers you have already seen and check for the needed complement.",
  },
  {
    title: "Palindrome Checker",
    description:
      "Write a function that returns true if a string reads the same forward and backward. Input: 'racecar' -> Output: true",
    difficulty: "Easy",
    starter_code:
      "function isPalindrome(str) {\n  // your code here\n}",
    expected_output: "true",
    hint: "Compare the original string with a reversed version of the string.",
  },
  {
    title: "Find Maximum Number",
    description:
      "Write a function that returns the largest number in an array. Input: [1,5,3,9,2] -> Output: 9",
    difficulty: "Easy",
    starter_code:
      "function findMaximum(numbers) {\n  // your code here\n}",
    expected_output: "9",
    hint: "Start with the first value and compare it with every other value in the array.",
  },
  {
    title: "Count Vowels",
    description:
      "Write a function that counts how many vowels are in a string. Input: 'hello' -> Output: 2",
    difficulty: "Easy",
    starter_code:
      "function countVowels(str) {\n  // your code here\n}",
    expected_output: "2",
    hint: "Loop through the string and check whether each character is a, e, i, o, or u.",
  },
  {
    title: "Remove Duplicates",
    description:
      "Write a function that removes duplicate values from an array while preserving the original order. Input: [1,2,2,3] -> Output: [1,2,3]",
    difficulty: "Medium",
    starter_code:
      "function removeDuplicates(values) {\n  // your code here\n}",
    expected_output: "[1,2,3]",
    hint: "A Set stores only unique values and can be converted back into an array.",
  },
  {
    title: "Factorial",
    description:
      "Write a function that returns the factorial of a non-negative integer. Input: 5 -> Output: 120",
    difficulty: "Easy",
    starter_code:
      "function factorial(number) {\n  // your code here\n}",
    expected_output: "120",
    hint: "Multiply every whole number from 1 through the given number. Remember that 0 factorial is 1.",
  },
  {
    title: "Sum an Array",
    description:
      "Write a function that returns the sum of all numbers in an array. Input: [1,2,3,4] -> Output: 10",
    difficulty: "Easy",
    starter_code:
      "function sumArray(numbers) {\n  // your code here\n}",
    expected_output: "10",
    hint: "Create a total variable, loop through the array, and add each number to the total.",
  },
];

/**
 * Inserts sample coding challenges that do not already exist.
 *
 * Existing challenges are identified by title and are skipped
 * so that running the seed multiple times does not create duplicates.
 *
 * @async
 * @returns {Promise<void>}
 */
async function seed() {
  let insertedCount = 0;
  let skippedCount = 0;

  try {
    for (const challenge of challenges) {
      const [existingRows] = await pool.query(
        "SELECT id FROM challenges WHERE title = ? LIMIT 1",
        [challenge.title]
      );

      if (existingRows.length > 0) {
        skippedCount += 1;
        continue;
      }

      await pool.query(
        `INSERT INTO challenges
          (title, description, difficulty, starter_code, expected_output, hint)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          challenge.title,
          challenge.description,
          challenge.difficulty,
          challenge.starter_code,
          challenge.expected_output,
          challenge.hint,
        ]
      );

      insertedCount += 1;
    }

    console.log(
      `Seed complete. Inserted ${insertedCount} challenges and skipped ${skippedCount} existing challenges.`
    );
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();