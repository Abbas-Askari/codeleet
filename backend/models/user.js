import mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    validate: {
      validator: async function (value) {
        const user = await this.constructor.findOne({ username: value });
        return !user;
      },
      message: "Username already in use",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
});

const User = mongoose.model("User", schema);

export default User;
