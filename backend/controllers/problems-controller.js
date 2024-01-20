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
  console.log({ problem });
  try {
    const newProblem = new Problem(problem);

    await newProblem.save();
    console.log({ newProblem, problem });
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
    console.log({ problems });

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
    console.log({ body: req.body, case1: testCases[0] });

    testCases = testCases.map((testCase) =>
      testCase.map((arg) => JSON.parse(arg))
    );
    const { logs, results, time } = await testProblem(
      solutionCode,
      functionName,
      testCases
    );

    console.log({ results });

    res.status(200).json({ logs, results, time });
  } catch (error) {
    res.status(400).json({ message: error.message, stack: error.stack });
  }
}

function testProblem(solutionCode, functionName, testCases) {
  return new Promise((resolve, reject) => {
    const logs = [];
    const results = [];
    console.log(solutionCode);
    try {
      const start = Date.now();
      vm.runInNewContext(
        `
            ${solutionCode}
            for (let i = 0; i < testCases.length; i++) {
                const args = testCases[i];
                const result = ${functionName}(...args);
                addResult(result);
            }
        `,
        {
          addResult: (result) => {
            results.push(result);
          },
          log: (...str) =>
            logs.push(str.map((obj) => JSON.stringify(obj)).join(" ")),
          testCases,
        }
      );
      console.log({ logs });
      resolve({ logs, results, time: Date.now() - start });
    } catch (error) {
      console.log({ error });
      reject(error);
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
