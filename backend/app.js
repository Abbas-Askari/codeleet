import express from "express";
import submissionsRouter from "./routes/submissions-route.js";
import problemsRouter from "./routes/problems-route.js";
import usersRouter from "./routes/users-route.js";
import cors from "cors";
import "dotenv/config.js";
import mongoose, { mongo } from "mongoose";

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/submissions", submissionsRouter);
app.use("/problems", problemsRouter);
app.use("/users", usersRouter);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log({ error });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
