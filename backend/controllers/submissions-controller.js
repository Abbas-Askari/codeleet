import vm from "vm";
import isEqual from "lodash.isequal";
import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
import "dotenv/config.js";

function runCode(code, problem) {
  return new Promise((resolve, reject) => {
    const logs = [];
    let failed = null;
    try {
      const testCases = JSON.parse(problem.inputs);
      const start = Date.now();
      vm.runInNewContext(
        `
                ${code}
                ${problem.solutionFunction.replace(
                  problem.functionName,
                  `${problem.functionName}_`
                )}
                for (let i = 0; i < testCases.length; i++) {
                    const args = testCases[i];
                    clearLogs();
                    const correct = ${problem.functionName}_(...args);
                    const user = ${problem.functionName}(...args);
                    if (!isEqual(correct, user)) {
                        fail(i, correct, user);
                        break;
                    }
                }
            `,
        {
          fail: (index, expected, recived) => {
            failed = {
              input: testCases[index],
              expected,
              recived,
              testCase: index + 1,
            };
          },
          log: (...str) => {
            if (logs.length >= +process.env.MAX_LOGS) return;
            logs.push(str.map((obj) => JSON.stringify(obj)).join(" "));
          },
          clearLogs: () => {
            logs.length = 0;
          },
          testCases,
          isEqual,
        },
        { timeout: +process.env.EXECUTION_TIMEOUT }
      );
      resolve({
        logs,
        failed,
        time: Date.now() - start,
        limitExceeded: false,
      });
    } catch (error) {
      if (error.code === "ERR_SCRIPT_EXECUTION_TIMEOUT") {
        resolve({
          logs,
          failed,
          time: 1001,
          limitExceeded: true,
        });
      } else {
        console.log({ error });
        reject(error);
      }
    }
  });
}

export async function createSubmission(req, res) {
  const { code } = req.body;
  const { problemId } = req.params;
  try {
    const problem = await Problem.findById(problemId);
    const { logs, failed, time, limitExceeded } = await runCode(code, problem);
    if (limitExceeded) {
      console.error("Time Limit Exceeded");
    }

    const submission = new Submission({
      problemId: problemId,
      userId: req.user._id,
      code,
      status: limitExceeded
        ? "Time Limit Exceeded"
        : failed
        ? "Wrong Answer"
        : "Accepted",
      time,
    });
    await submission.save();

    console.log({ failed, time, limitExceeded, logs });
    res
      .status(200)
      .json({ success: !failed, logs, failed, time, limitExceeded });
  } catch (error) {
    console.log({ error }, error);
    res.status(400).json({ message: error.message, stack: error.stack });
  }
}

export async function getAllSubmissionsOfUser(req, res) {
  try {
    // return all submission for a problem posted by the user who is logged in
    // also return the acceptance rate of the problem and average time taken
    const { problemId } = req.params;
    const submissions = await Submission.find({
      problemId,
      userId: req.user._id,
    });
    res.status(200).json({ submissions: submissions.map((s) => s.toJSON()) });
    // const problem = await Problem.findById(req.params.problemId);
    // res.status(200).json(problem);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, stack: error.stack });
  }
}

function testCaseSeperately(problem, code, testCase) {
  return new Promise((resolve, reject) => {
    const logs = [];
    let result = null;
    let expected = null;
    try {
      const start = Date.now();
      vm.runInNewContext(
        `
          ${code}
          ${problem.solutionFunction.replace(
            problem.functionName,
            `${problem.functionName}_`
          )}
          const correct = ${problem.functionName}_(...args);
          const user = ${problem.functionName}(...args);
          setResult(user);
          setExpected(correct);
      `,
        {
          log: (...str) => {
            if (logs.length >= +process.env.MAX_LOGS) return;
            logs.push(str.map((obj) => JSON.stringify(obj)).join(" "));
          },
          setResult: (r) => (result = r),
          setExpected: (e) => (expected = e),
          testCase,
          isEqual,
          args: testCase,
        },
        { timeout: +process.env.EXECUTION_TIMEOUT }
      );
      console.log({ logsLength: logs.length }, +process.env.MAX_LOGS);
      resolve({
        logs,
        result,
        expected,
        time: Date.now() - start,
        limitExceeded: false,
      });
    } catch (error) {
      if (error.code === "ERR_SCRIPT_EXECUTION_TIMEOUT") {
        resolve({
          logs,
          time: 1001,
          limitExceeded: true,
        });
      } else {
        console.log({ error });
        resolve({ error, logs });
      }
    }
  });
}

export async function testProvidedCases(req, res) {
  try {
    const { code, problem, testCases } = req.body;
    const logs = [];
    const times = [];
    const results = [];
    const errors = [];
    const expecteds = [];

    console.log({ testCases, code, problem });

    const promises = testCases.map((testCase) =>
      testCaseSeperately(problem, code, testCase)
    );

    const resultsArray = await Promise.all(promises);
    resultsArray.forEach((result) => {
      logs.push(result.logs);
      times.push(result.time);
      results.push(result.result);
      if (result.error) {
        errors.push(result.error.message + " \n " + result.error.stack);
      } else {
        errors.push("");
      }
      expecteds.push(result.expected);
      console.log({ result });
    });

    res.status(200).json({ logs, times, results, errors, expecteds });
  } catch (error) {
    console.log({ error });
    res.status(400).json({ message: error.message, stack: error.stack });
  }
}
