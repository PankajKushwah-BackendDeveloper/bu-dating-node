import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: Number,
      required: true,
      unique: true
    },
    country: {
      type: String,
      required: true,
    },
    motive: {
      type: String,
      required: true
    },
    profileimage: {
      type: String,
      required: true,
    },
    image: {
      path: {
        type: String,
        required: true,
      },
      filename: {
        type: String,
        required: true,
      }
    },
    age: Number,
    gender: String,
    dob: Date
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
