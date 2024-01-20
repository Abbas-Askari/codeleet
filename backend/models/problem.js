import mongoose from "mongoose";
import Submission from "./submission.js";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    inputs: { type: String, required: true },
    solutionFunction: { type: String, required: true },
    template: { type: String, required: true },
    functionName: { type: String, required: true },
    params: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    contributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { toJSON: { virtuals: true } }
);

// schema.virtual("acceptanceRate").get(async function () {
//   const totalSubmissions = Submission.find({ problemId: this._id })
//     .count()
//     .exec();
//   const totalAccepted = Submission.find({
//     problemId: this._id,
//     status: "Accepted",
//   })
//     .count()
//     .exec();
//   console.log({ totalSubmissions, totalAccepted });

//   return totalSubmissions !== 0 ? totalAccepted / totalSubmissions : 0;
// });

const Problem = mongoose.model("Problem", schema);

export default Problem;
