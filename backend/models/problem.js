import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    inputs: { type: String, required: true },
    solutionFunction: { type: String, required: true },
    template: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Problem = mongoose.model("Problem", schema);

export default Problem;