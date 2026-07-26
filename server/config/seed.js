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
    {
    title: "Longest Word",
    description:
      "Write a function that returns the longest word in a sentence. If multiple words have the same length, return the first one. Input: 'CodeSpark makes coding fun' -> Output: 'CodeSpark'",
    difficulty: "Easy",
    starter_code:
      "function longestWord(sentence) {\n  // your code here\n}",
    expected_output: "CodeSpark",
    hint: "Split the sentence into words and keep track of the longest word you have seen.",
  },
  {
    title: "Prime Number Checker",
    description:
      "Write a function that returns true if a number is prime and false otherwise. Input: 7 -> Output: true",
    difficulty: "Easy",
    starter_code:
      "function isPrime(number) {\n  // your code here\n}",
    expected_output: "true",
    hint: "Numbers less than 2 are not prime. Check whether the number is divisible by any value from 2 through its square root.",
  },
  {
    title: "Fibonacci Number",
    description:
      "Write a function that returns the Fibonacci number at the given position. Use 0 and 1 as the first two values. Input: 6 -> Output: 8",
    difficulty: "Easy",
    starter_code:
      "function fibonacci(number) {\n  // your code here\n}",
    expected_output: "8",
    hint: "Start with 0 and 1, then repeatedly add the previous two values.",
  },
  {
    title: "Find Missing Number",
    description:
      "Given an array containing distinct numbers from 0 through n with one number missing, return the missing number. Input: [3,0,1] -> Output: 2",
    difficulty: "Medium",
    starter_code:
      "function findMissingNumber(numbers) {\n  // your code here\n}",
    expected_output: "2",
    hint: "Compare the expected sum of the numbers from 0 through n with the actual array sum.",
  },
  {
    title: "Array Intersection",
    description:
      "Write a function that returns the unique values found in both arrays. Preserve the order from the first array. Input: [1,2,2,3] and [2,3,4] -> Output: [2,3]",
    difficulty: "Medium",
    starter_code:
      "function arrayIntersection(first, second) {\n  // your code here\n}",
    expected_output: "[2,3]",
    hint: "Check which values from the first array are included in the second array, then remove duplicates.",
  },
  {
    title: "Valid Parentheses",
    description:
      "Write a function that returns true when every opening bracket has the correct closing bracket in the correct order. The possible brackets are (), [], and {}. Input: '({[]})' -> Output: true",
    difficulty: "Medium",
    starter_code:
      "function validParentheses(value) {\n  // your code here\n}",
    expected_output: "true",
    hint: "Use an array as a stack. Add opening brackets and remove the most recent one when a matching closing bracket appears.",
  },
  {
    title: "Binary Search",
    description:
      "Write a function that searches a sorted array and returns the index of the target. Return -1 when the target is not present. Input: [1,3,5,7,9], target=7 -> Output: 3",
    difficulty: "Medium",
    starter_code:
      "function binarySearch(numbers, target) {\n  // your code here\n}",
    expected_output: "3",
    hint: "Repeatedly compare the target with the middle value and eliminate half of the remaining array.",
  },
  {
    title: "Chunk an Array",
    description:
      "Write a function that divides an array into smaller arrays of the given size. Input: [1,2,3,4,5], size=2 -> Output: [[1,2],[3,4],[5]]",
    difficulty: "Medium",
    starter_code:
      "function chunkArray(values, size) {\n  // your code here\n}",
    expected_output: "[[1,2],[3,4],[5]]",
    hint: "Move through the array by the chunk size and use slice to create each smaller array.",
  },
  {
    title: "Flatten an Array",
    description:
      "Write a function that converts a nested array into a single-level array. Arrays may contain multiple levels of nesting. Input: [1,[2,[3,4]],5] -> Output: [1,2,3,4,5]",
    difficulty: "Medium",
    starter_code:
      "function flattenArray(values) {\n  // your code here\n}",
    expected_output: "[1,2,3,4,5]",
    hint: "Use recursion when a value is another array, or use the flat method with an infinite depth.",
  },
  {
    title: "Longest Unique Substring",
    description:
      "Write a function that returns the length of the longest substring containing no repeated characters. Input: 'abcabcbb' -> Output: 3",
    difficulty: "Hard",
    starter_code:
      "function longestUniqueSubstring(value) {\n  // your code here\n}",
    expected_output: "3",
    hint: "Use a sliding window and track the most recent position of each character.",
  },
  {
    title: "Merge Overlapping Intervals",
    description:
      "Write a function that combines overlapping intervals. Input: [[1,3],[2,6],[8,10],[15,18]] -> Output: [[1,6],[8,10],[15,18]]",
    difficulty: "Hard",
    starter_code:
      "function mergeIntervals(intervals) {\n  // your code here\n}",
    expected_output: "[[1,6],[8,10],[15,18]]",
    hint: "Sort the intervals by their starting values, then compare each interval with the most recently merged interval.",
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