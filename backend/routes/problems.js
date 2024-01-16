import  express  from "express";
import Problem from "../models/problem.js";

const router = express.Router();
// POST to save a new question
router.post('/', async (req, res) => {
    const problem = {
        title: req.body.title,
        description: req.body.description,
        inputs: req.body.inputs,
        solutionFunction: req.body.solutionFunction,
        template: req.body.template,
    }
    console.log({problem})
    try {
        const newProblem = new Problem(problem);
     
        await newProblem.save();
        res.status(201).json(newProblem);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}); 



export default router;
