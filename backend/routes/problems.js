import express from "express";
import Problem from "../models/problem.js";
import {
  createProblem,
  getAllProblems,
  getProblem,
  testNewProblem,
} from "../controllers/problems.js";

const router = express.Router();
// POST to save a new question
router.post("/", createProblem);

router.post("/test", testNewProblem);

router.get("/", getAllProblems);

router.get("/:id", getProblem);

export default router;
