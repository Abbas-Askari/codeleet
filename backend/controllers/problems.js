import vm from "vm";
import Problem from "../models/problem.js";
import e from "express";

export async function createProblem(req, res) {
  const problem = {
    title: req.body.title,
    description: req.body.description,
    inputs: req.body.inputs,
    solutionFunction: req.body.solutionFunction,
    template: req.body.template,
    functionName: req.body.functionName,
  };
  console.log({ problem });
  try {
    const newProblem = new Problem(problem);

    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllProblems(req, res) {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function getProblem(req, res) {
  try {
    const problem = await Problem.findById(req.params.id);
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
