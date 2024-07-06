import User from "../models/userModel.js";
import JWT from "jsonwebtoken";
import path from 'path'
import fs from "fs";
import { fileURLToPath } from "url";
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
      age,
      gender,
      dob
    } = req.body;

    if(!req.file) return res.status(400).json({
      message:'please provide profile image'
    })
    const requiredFields = ["name", "email", "phone", "country",'motive','gender','dob','age'];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ success: false, message: `${field} is required` });
      }
    }
    let existingUser= await User.findOne({email});
    if(existingUser) return res.status(400).json({
      success:false,
      message:`A user is already registered with '${email}'`
    })
     existingUser= await User.findOne({phone});
    if(existingUser) return res.status(400).json({
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
      age,
      gender,
      dob
    });


    const savedUser = await newUser.save();

    res.status(201).json({
success:true,
message:`${name} registered successfully`,
user:savedUser
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      success:false,
      message:'Internal server error',
      error: 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
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

export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};



export const userLogin = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "phone number is required",
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "8d",
    });

    const { password, ...userData } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
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
    const users = await User.find().select('-__v -createdAt -updatedAt');

    return res.status(200).send({
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
      return res.status(400).send("File name is required");
    }

    const directoryPath = path.join(__dirname, "../../public/userProfile");

    if (!fs.existsSync(directoryPath)) {
      return res.status(500).send("Directory not found");
    }

    const filePath = path.join(directoryPath, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    res.setHeader("Content-Disposition", "inline; filename=" + fileName);
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Internal Server Error");
  }
};