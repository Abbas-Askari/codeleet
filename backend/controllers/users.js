import User from "../models/user.js";
import jwt from "jsonwebtoken";

export async function createUser(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();

    jwt.sign(user.toJSON(), process.env.JWT_SECRET, (err, token) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ user: user.toJSON(), token });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function validate(req, res, next) {
  const { token } = req.headers;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.password !== password)
    return res.status(400).json({ message: "Invalid credentials" });

  jwt.sign(user.toJSON(), process.env.JWT_SECRET, (err, token) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json({ user: user.toJSON(), token });
  });
}
