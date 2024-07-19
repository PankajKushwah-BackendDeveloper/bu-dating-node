import { hashSync } from "bcrypt";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";
import validator from "validator";
import Admin from "../models/adminModel.js";
import nodemailer from "nodemailer";

export const adminSignUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const requiredFields = ["email", "password"];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(200)
          .json({ success: false, message: `${field} is required` });
      }
    }

    if (!validator.isEmail(email)) {
      return res.status(200).send({
        success: false,
        message: "Please provide a valid email",
      });
    }

    const existingadmin = await Admin.findOne({ email: email });

    if (existingadmin)
      return res.status(200).send({
        success: false,
        message: "email is already registered",
      });

    const hashedPassword = await hashPassword(password);
    const newadmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newadmin.save();
    return res.status(200).send({
      success: true,
      message: `Registered successfully. Please verify your email with OTP.`,
      admin: newadmin,
    });
  } catch (error) {
    console.error("Error during admin sign up:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const sendOTPEmail = async (email, otp) => {
  try {
    // console.log(email)

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        admin: "pankajkushwahuec@gmail.com",
        pass: "oido vnwf prwc pscb",
      },
    });

    const mailOptions = {
      from: "pankajkushwahuec@gmail.com",
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP is: ${otp}`,
      html: `<h1>${otp}</h1>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error ",
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).send({
        success: false,
        message: "Invalid email or Password",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(200).send({
        success: false,
        message: `admin with ${email} is not found`,
      });
    }

    const match = await comparePassword(password, admin.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = JWT.sign({ _id: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "8d",
    });

    const { password: _, ...adminData } = admin.toObject();

    res.status(200).send({
      success: true,
      message: "Login successful",
      admin: adminData,
      token,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const adminId = req.user._id;

    const admin = await Admin.findById(adminId).select({ password: 0 });

    if (!admin) {
      return res.status(200).send({
        success: false,
        message: "admin does not exist",
      });
    }

    return res.status(200).send({
      success: true,
      message: "admin fetched successfully",
      admin,
    });
  } catch (error) {
    console.error("Error fetching admin:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};





function generateOtp() {
  const min = 100000;
  const max = 999999;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
