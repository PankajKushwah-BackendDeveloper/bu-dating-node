import mongoose from "mongoose";
import validator from "validator";

const adminSchma = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
      },
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },

    otpCode: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchma);
