import  express  from "express";
import vm from 'vm';
import axios from 'axios';
import e from "express";
import isEqual from "lodash.isequal";
import Problem from "../models/problem.js";

const router = express.Router();

// POST route to log the submitted code
router.post('/', async (req, res) => {
    const { code } = req.body;
    try {
        const {logs, failed, time} = await runCode(code);
        res.status(200).json({success: !failed, logs, failed, time});
    } catch (error) {
        console.log({error})
        res.status(400).json({message: error.message, stack: error.stack});
    }
});

function runCode(code, problem) {
    const testCases = JSON.parse(problem.inputs);
    console.log({testCases, problem})

    return new Promise((resolve, reject) => {
        const logs = [];
        let failed = {};
        try {
            const start = Date.now();
            vm.runInNewContext(`
                ${code}
                ${problem.solutionFunction}

                for (let i = 0; i < testCases.length; i++) {
                    const args = testCases[i];
                    const correct = ${problem.functionName}_(...args);
                    const user = ${problem.functionName}(...args);
                    if (!isEqual(correct, user)) {
                        fail(i, correct, user);
                        break;
                    }
                }
            `, {
                fail: (index, expected, recived) => {
                    failed = {input: testCases[index], expected, recived, testCase: index + 1};
                },
                log: (...str) => logs.push(str.join(' ')),
                testCases,
                isEqual
            })
            console.log({logs})
            resolve({logs, failed, time: Date.now() - start});
        } catch (error) {
            console.log({error})
            reject(error);
        }
    });
}


// function runCode(code) {
//     const testCases = [
//         [{a: 1, b: 3}],
//         [{a: 2, b: 2}],
//         [{a: 3, b: 3}],
//     ];
//     const correctFunction = `
//         function addCorrect(o) {
//             return {c: o.a + o.b};
//         }
//     `
    
//     return new Promise((resolve, reject) => {
//         const logs = [];
//         let failed = {};
//         try {
//             const start = Date.now();
//             vm.runInNewContext(`
//                 ${code}
//                 ${correctFunction}

//                 for (let i = 0; i < testCases.length; i++) {
//                     const args = testCases[i];
//                     const correct = addCorrect(...args);
//                     const user = add(...args);
//                     if (!isEqual(correct, user)) {
//                         fail(i, correct, user);
//                         break;
//                     }
//                 }
//             `, {
//                 fail: (index, expected, recived) => {
//                     failed = {input: testCases[index], expected, recived, testCase: index + 1};
//                 },
//                 log: (...str) => logs.push(str.join(' ')),
//                 testCases,
//                 isEqual
//             })
//             console.log({logs})
//             resolve({logs, failed, time: Date.now() - start});
//         } catch (error) {
//             console.log({error})
//             reject(error);
//         }
//     });
// }

router.post('/:id', async (req, res) => {
    const { code } = req.body;
    const { id } = req.params;
    try {
        const problem = await Problem.findById(id);
        const {logs, failed, time} = await runCode(code, problem);
        res.status(200).json({success: !failed, logs, failed, time});
    } catch (error) {
        console.log({error})
        res.status(400).json({message: error.message, stack: error.stack});
    }
});


export default router;
