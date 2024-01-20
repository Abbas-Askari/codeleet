import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  time: {
    type: Number,
    required: true,
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
