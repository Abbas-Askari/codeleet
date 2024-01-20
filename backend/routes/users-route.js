import express from "express";
import { createUser, login } from "../controllers/users-controller.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();
// POST to save a new question
router.post("/", createUser);

router.post("/login", login);

export default router;
