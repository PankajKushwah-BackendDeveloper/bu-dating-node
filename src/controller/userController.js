import User from "../models/userModel.js";
import JWT from "jsonwebtoken";
import path from 'path'
import mongoose from "mongoose";
import fs from "fs";
import { fileURLToPath } from "url";
import { resourceUsage } from "process";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const userSignUp = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      country,
      motive,
      gender,
      dob,
      fun,
      music,
      sports
    } = req.body;

    if(!req.file) return res.status(200).json({
      success:false,
      message:'please provide profile image'
    })
    const requiredFields = ["name",  "phone", "country",'motive','gender','dob'];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(200)
          .json({ success: false, message: `${field} is required` });
      }
    }
    
    let existingUser= await User.findOne({phone});
    if(existingUser) return res.status(200).json({
      success:false,
      message:`A user is already registered with '${phone}'`
    })

    const profileimage = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/get-image/${req.file.filename}`;
    const newUser = new User({
      name,
      email,
      phone,
      country,
      motive,
      profileimage,
      image:{
        filename:req.file.filename,
        path:req.file.path
      },
      
      gender,
      dob,
      fun,
      music,
      sports
    });
    const age = calculateAge(dob);
newUser.age = age;
    const savedUser = await newUser.save();
    const user = savedUser;

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

    res.status(200).json({
success:true,
message:`${name} registered successfully`,
token,
user:savedUser
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getUserById = async (req, res) => {
  try {
    const {userId} = req.params;

    if(!userId || !mongoose.Types.ObjectId.isValid(userId)) return res.status(200).send({
      success:false,
      message:'please provide user id'
    })
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        success:false,
        message:'User not found with this id',
        error: 'User not found' });
    }
    res.status(200).json({
      success:true,
      message:`details of ${user.name} fetched `,
      user});
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if ( !otp) {
      return res.status(200).json({
        success: false,
        message: "phone number and  OTP are required",
      });
    }

    const user = await User.findOne({ phone });
    if (!user||user.otp!=otp ) {
      return res.status(200).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

    // user.otp = null;
    await user.save();

    const { password, ...userData } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(200).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    const otp=9999;
    // user.otp = otp;
    await user.save()


    return res.status(200).json({
      success: true,
      message: `your otp is ${otp}`,
     
    });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
  

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-image -createdAt -updatedAt -__v");

    return res.status(200).send({
      success: true,
      message: "user details fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error during getting user profile", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllUsers = async(req,res)=>{
  try {
    const users = await User.find().select('-friends -__v -createdAt -updatedAt');

    return res.status(200).send({
      success:true,
      message:"All users are fetched",
      users
    })
  } catch (error) {
  console.log('error: ', error);
    
  }
}



export const getProfileImage = async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      return res.status(200).send("File name is required");
    }

    const directoryPath = path.join(__dirname, "../../public/userProfile");

    if (!fs.existsSync(directoryPath)) {
      return res.status(500).send("Directory not found");
    }

    const filePath = path.join(directoryPath, fileName);

    if (!fs.existsSync(filePath)) {
    return res.status(200).send({
      success:true,
      message:"File not found"});
    }

    res.setHeader("Content-Disposition", "inline; filename=" + fileName);
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Internal Server Error");
  }
};

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


export const updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if(!userId || !mongoose.Types.ObjectId.isValid(userId)) return res.status(200).send({
      success:false,
      message:'please provide valid id'
    })
    

    const {
      name,
      email,
      country,
      motive,
      gender,
      dob,
      fun,
      music,
      sports,
    } = req.body;
console.log(req.body)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let age;
    if (dob) {
     age = calculateAge(dob);
    }
    let profileimage;
    if(req.file){
       profileimage = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/user/get-image/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: name || user.name,
          email: email || user.email,
          country: country || user.country,
          motive: motive || user.motive,
          gender: gender || user.gender,
          dob: dob || user.dob,
          age: age !== undefined ? age : user.age,
          profileimage: profileimage !== undefined ? profileimage : user.profileimage,
          fun: fun || user.fun,
          music: music || user.music,
          sports: sports || user.sports,
        }
      },
      { new: true } 
    );

    return res.status(200).json({
      success: true,
      message: 'User details updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating user details:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};

export const deleteUser = async(req,res)=>{
  try {
    const {userId} = req.params;

    if(!userId||!mongoose.Types.ObjectId.isValid(userId)) return res.status(200).send({
      success:false,
      message:'please provide valid user id'
    })

    const deletedUser = await User.findByIdAndDelete(userId);

    if(!deletedUser) return res.status(200).send({
      success:false,
      message:'User not found with this id'
    })

    return res.status(200).send({
      success:true,
      message:`${deletedUser.name} is deleted` 
    })
  } catch (error) {
    return res.status(500).send({
      success:false,
      message:'Internal server error',
      error:error.message
    })
  }
}