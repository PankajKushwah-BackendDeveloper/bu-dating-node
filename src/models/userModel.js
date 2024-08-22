import mongoose from "mongoose";


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    country_code:{
type:String,
    },
    country_dial_code:{
      type:String,
      
    },
   password:String,
    phone: {
      type: Number,
      unique: true
    },
    isVerified:{
      type:Boolean,
      default:false,
    },
    country: {
      type: String,
    },
    motive: {
      type: String,
    },
    profileimage: {
      type: String,
    },
    image: {
      path: {
        type: String,
      },
      filename: {
        type: String,
      }
    },
    friends: [
      {
        type:mongoose.Types.ObjectId,
        ref:'User'
      }
  ],
  friendRequest:[{
    type:mongoose.Types.ObjectId,
    ref:'User'
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
    },
    age:{
      type:String,
    }
  },
  { timestamps: true }
);



export default mongoose.model("User", userSchema);
