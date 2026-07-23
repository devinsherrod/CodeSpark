const vm = require("node:vm");

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
};

function valuesMatch(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

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

module.exports = {
  runChallengeTests,
};