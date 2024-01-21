import isEqual from "lodash.isequal";

export function outputLocal(problem, testCase) {
  const args = JSON.stringify(testCase);
  const code = `
  ${problem.solutionFunction}
  ${problem.functionName}(...JSON.parse(\`${args}\`))`;
  const result = eval(code);
  return result;
}

export function isValidIdentifier(str) {
  return /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(str);
}

export function isValidTestCaseArg(arg) {
  try {
    JSON.parse(arg);
    return true;
  } catch (error) {
    return false;
  }
}

// export function runLocal(code, problem, testCase) {
//   const logs = [];
//   const failed = null;
//   const start = Date.now();
//   let result = null;
//   try {
//     console.log({ testCase });
//     const args = JSON.stringify(testCase);
//     console.log({ args: JSON.parse(args) }, ": args");
//     function log(...str) {
//       logs.push(str.map((obj) => JSON.stringify(obj)).join(" "));
//     }
//     const script = `
//         ${code}
//         // run user code
//         ${problem.functionName}(...JSON.parse(\`${args}\`));
//         `;
//     console.log(script);
//     result = eval(script);
//     const expected = outputLocal(problem, testCase);
//     if (!isEqual(result, expected)) {
//       failed = {
//         input: testCase,
//         expected: expected,
//         recived: result,
//       };
//     }
//     console.log({ result });
//     return { result, failed, logs, time: Date.now() - start };
//   } catch (error) {
//     console.log({ error });
//     return { result, failed, logs, time: Date.now() - start, error };
//   }
// }
