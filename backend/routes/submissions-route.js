import express from "express";
import { validate } from "../controllers/users-controller.js";
import {
  createSubmission,
  getAllSubmissionsOfUser,
  testProvidedCases,
} from "../controllers/submissions-controller.js";

const router = express.Router();

router.post("/testProvidedCases", testProvidedCases);

router.post("/:problemId", validate, createSubmission);

router.get("/:problemId", validate, getAllSubmissionsOfUser);

export default router;
