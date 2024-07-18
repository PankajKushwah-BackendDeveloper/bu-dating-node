import JWT from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const [bearer, token] = authorizationHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token format",
      });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in requireSignIn middleware:", error);

    let errorMessage = "Please provide a valid token";
    if (error.name === "TokenExpiredError") {
      errorMessage = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid token";
    }

    res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await Admin.findById(userId);

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "No user found with this email",
      });
    }

    if (user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "You are not an admin",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

export const isVerifiedUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(200).send("Please enter Email and Password both");

    const user = await Admin.findOne({ email });

    if (!user)
      return res.status(200).send({
        success: false,
        message: `User not found with ${email} email`,
      });

    if (!user.isVerified) {
      return res.status(200).send({
        success: false,
        message: "Please verify your email first",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};
