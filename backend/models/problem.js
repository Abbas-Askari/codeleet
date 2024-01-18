import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  inputs: { type: String, required: true },
  solutionFunction: { type: String, required: true },
  template: { type: String, required: true },
  functionName: { type: String, required: true },
  params: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  contributor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Problem = mongoose.model("Problem", schema);

export default Problem;
