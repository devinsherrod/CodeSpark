/**
 * @file challengeRunner.js
 * @description
 * Executes user-submitted JavaScript solutions against predefined
 * automated test cases for CodeSpark coding challenges.
 */

const vm = require("node:vm");

/**
 * Collection of automated test cases for each coding challenge.
 *
 * Each challenge specifies:
 * - the required function name
 * - one or more test cases
 *
 * @constant {Object}
 */
const challengeTests = {
  "Reverse String": {
    functionName: "reverseString",
    tests: [
      { args: ["hello"], expected: "olleh" },
      { args: ["CodeSpark"], expected: "krapSedoC" },
      { args: [""], expected: "" },
      { args: ["a"], expected: "a" },
    ],
  },

  FizzBuzz: {
    functionName: "fizzBuzz",
    tests: [
      {
        args: [],
        expected:
          "1,2,Fizz,4,Buzz,Fizz,7,8,Fizz,Buzz,11,Fizz,13,14,FizzBuzz",
      },
    ],
  },

  "Two Sum": {
    functionName: "twoSum",
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
    ],
  },

  "Palindrome Checker": {
    functionName: "isPalindrome",
    tests: [
      { args: ["racecar"], expected: true },
      { args: ["hello"], expected: false },
      { args: [""], expected: true },
      { args: ["level"], expected: true },
    ],
  },

  "Find Maximum Number": {
    functionName: "findMaximum",
    tests: [
      { args: [[1, 5, 3, 9, 2]], expected: 9 },
      { args: [[-10, -3, -20]], expected: -3 },
      { args: [[7]], expected: 7 },
      { args: [[4, 4, 4]], expected: 4 },
    ],
  },

  "Count Vowels": {
    functionName: "countVowels",
    tests: [
      { args: ["hello"], expected: 2 },
      { args: ["CodeSpark"], expected: 3 },
      { args: [""], expected: 0 },
      { args: ["rhythm"], expected: 0 },
    ],
  },

  "Remove Duplicates": {
    functionName: "removeDuplicates",
    tests: [
      { args: [[1, 2, 2, 3, 3, 4]], expected: [1, 2, 3, 4] },
      { args: [["a", "a", "b", "c", "c"]], expected: ["a", "b", "c"] },
      { args: [[]], expected: [] },
      { args: [[5, 5, 5]], expected: [5] },
    ],
  },

  Factorial: {
    functionName: "factorial",
    tests: [
      { args: [5], expected: 120 },
      { args: [0], expected: 1 },
      { args: [1], expected: 1 },
      { args: [7], expected: 5040 },
    ],
  },

  "Sum an Array": {
    functionName: "sumArray",
    tests: [
      { args: [[1, 2, 3, 4]], expected: 10 },
      { args: [[-2, 5, -1]], expected: 2 },
      { args: [[]], expected: 0 },
      { args: [[10]], expected: 10 },
    ],
  },
};

/**
 * Determines whether two values are equal.
 *
 * Objects and arrays are compared by converting them to JSON.
 *
 * @param {*} actual - Actual value returned by the user's solution.
 * @param {*} expected - Expected value for the test case.
 * @returns {boolean} True if the values are equivalent.
 */
function valuesMatch(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

/**
 * Executes a submitted solution against the automated test suite
 * for a specific coding challenge.
 *
 * The submitted code is executed inside a sandboxed Node.js VM
 * context to isolate it from the server environment.
 *
 * @param {string} title - Title of the coding challenge.
 * @param {string} code - JavaScript source code submitted by the user.
 * @returns {Object} Test execution result containing pass/fail information.
 */
function runChallengeTests(title, code) {
  const challenge = challengeTests[title];

  if (!challenge) {
    return {
      passed: false,
      error: "No automated tests are configured for this challenge.",
    };
  }

  try {
    const sandbox = Object.create(null);
    vm.createContext(sandbox);

    const setupScript = new vm.Script(`
      "use strict";
      ${code}

      if (typeof ${challenge.functionName} !== "function") {
        throw new Error("Required function ${challenge.functionName} was not found.");
      }

      globalThis.submittedFunction = ${challenge.functionName};
    `);

    setupScript.runInContext(sandbox, {
      timeout: 1000,
    });

    for (const test of challenge.tests) {
      sandbox.testArguments = test.args;

      const testScript = new vm.Script(`
        submittedFunction(...testArguments);
      `);

      const actual = testScript.runInContext(sandbox, {
        timeout: 1000,
      });

      if (!valuesMatch(actual, test.expected)) {
        return {
          passed: false,
          expected: test.expected,
          actual,
        };
      }
    }

    return { passed: true };
  } catch (error) {
    return {
      passed: false,
      error: error.message,
    };
  }
}

/**
 * Exports the automated challenge runner.
 */
module.exports = {
  runChallengeTests,
};