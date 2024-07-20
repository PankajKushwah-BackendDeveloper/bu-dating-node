import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    fun: [{
      type: String,
    }],
    music: [{
      type: String,
    }],
    sports: [{
      type: String,
    }],
    gender: String,
    dob: Date,
    otp: {
      type: String,
      default:"9999"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
