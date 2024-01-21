import vm from "vm";
import Problem from "../models/problem.js";
import e from "express";
import Submission from "../models/submission.js";

export async function createProblem(req, res) {
  const problem = {
    title: req.body.title,
    description: req.body.description,
    inputs: req.body.inputs,
    solutionFunction: req.body.solutionFunction,
    template: req.body.template,
    functionName: req.body.functionName,
    params: req.body.params,
    contributor: req.body.contributor,
  };
  try {
    const newProblem = new Problem(problem);

    await newProblem.save();
    res.status(200).json(newProblem);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, stack: error.stack });
  }
}

export async function getAllProblems(req, res) {
  try {
    // const problems = await Problem.find().populate("contributor").exec();

    const problems = await Problem.aggregate([
      {
        $lookup: {
          from: "submissions",
          localField: "_id",
          foreignField: "problemId",
          as: "submissions",
          pipeline: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        },
      },
    ]).exec();
    problems.forEach((problem) => {
      problem.submissions = {
        total: problem.submissions.reduce((acc, curr) => acc + curr.count, 0),
        accepted: problem.submissions.find((s) => s._id === "Accepted")?.count,
      };
      problem.submissions.accpetanceRate =
        problem.submissions.total === 0
          ? 0
          : problem.submissions.accepted / problem.submissions.total;

      if (problem.submissions.accpetanceRate >= 0.5) {
        problem.difficulty = "Easy";
      } else if (problem.submissions.accpetanceRate >= 0.2) {
        problem.difficulty = "Medium";
      } else {
        problem.difficulty = "Hard";
      }
    });

    res.status(200).json(problems);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
}

export async function getProblem(req, res) {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate("contributor")
      .exec();
    res.status(200).json(problem);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function testNewProblem(req, res) {
  try {
    let { testCases, functionName, code: solutionCode } = req.body;

    const promises = testCases.map((testCase) =>
      testCaseSeperately(solutionCode, functionName, testCase)
    );

    const returns = await Promise.all(promises);
    const logs = returns.map((returned) => returned.logs);
    const times = returns.map((returned) => returned.time);
    const errors = returns.map((returned) => returned.error);
    const results = returns.map((returned) => returned.result);

    console.log({ logs, results, times, errors });

    res.status(200).json({ logs, results, times, errors });
  } catch (error) {
    res.status(400).json({ message: error.message, stack: error.stack });
  }
}

function testCaseSeperately(solutionCode, functionName, testCase) {
  return new Promise((resolve, reject) => {
    const logs = [];
    let result = null;
    const start = Date.now();
    try {
      vm.runInNewContext(
        `
            ${solutionCode}
            setResult(${functionName}(...args));
        `,
        {
          setResult: (r) => (result = r),
          log: (...str) => {
            if (logs.length >= +process.env.MAX_LOGS) return;
            logs.push(str.map((obj) => JSON.stringify(obj)).join(" "));
          },
          args: testCase,
        },
        { timeout: +process.env.EXECUTION_TIMEOUT }
      );
      console.log({ logs });
      resolve({ logs, result, time: Date.now() - start });
    } catch (error) {
      if (error.code === "ERR_SCRIPT_EXECUTION_TIMEOUT") {
        resolve({
          logs,
          time: 1001,
          limitExceeded: true,
        });
      } else {
        console.log({ error });
        resolve({ error: error.message + " \n " + error.stack, logs });
      }
    }
  });
}

export async function deleteProblem(req, res) {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    res.status(200).json(problem);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
