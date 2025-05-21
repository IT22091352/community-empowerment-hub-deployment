const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

//register
const registerUser = async (req, res) => {
  const { userName, email, password, role} = req.body;
  try {
    console.log("Registration attempt for:", email);
    
    // Validate required fields
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: username, email and password are required",
      });
    }
    
    // Check if user already exists
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      console.log("Registration failed: Email already exists:", email);
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 12);
    
    // Create new user with validated role
    const validRole = ['seller', 'buyer', 'admin'].includes(role) ? role : 'buyer';
    
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      role: validRole,
    });

    // Save the user
    await newUser.save();
    console.log("User registration successful:", email);
    
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.error("Registration error:", e);
    console.error("Error stack:", e.stack);
    
    // More detailed error messages for different types of errors
    let errorMessage = "Internal server error occurred";
    
    if (e.name === 'ValidationError') {
      errorMessage = "Validation error: " + Object.values(e.errors).map(err => err.message).join(', ');
    } else if (e.code === 11000) {
      errorMessage = "Duplicate key error: A user with that information already exists";
    } else if (e.name === 'MongoServerError') {
      errorMessage = "Database error: " + e.message;
    } else if (e.name === 'MongooseError') {
      errorMessage = "Mongoose error: " + e.message;
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'production' ? undefined : e.message
    });
  }
};

//login
const loginUser = async (req, res) => {
  try {
    // Validate request payload
    await check("email", "Valid email is required").isEmail().run(req);
    await check("password", "Password is required").notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist! Please register first",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "60m" }
    );

    // Set secure and domain options for cookies based on environment
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
      // Don't set specific domain in development to work with localhost
      ...(process.env.NODE_ENV === "production" && { domain: '.herokuapp.com' })
    };

    res.cookie("token", token, cookieOptions).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    
    // Optional: fetch complete user info if needed
    // const user = await User.findById(decoded.id).select('-password');
    // if (!user) return res.status(401).json({ success: false, message: "User not found!" });
    // req.user = {...decoded, ...user.toObject()};
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

// Add this to your auth-controller.js
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id; // From auth middleware

  try {
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware,changePassword };
