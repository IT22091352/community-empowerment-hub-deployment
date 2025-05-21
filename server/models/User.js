const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['seller', 'buyer', 'admin'],
      message: 'Role must be seller, buyer, or admin'
    },
    default: "buyer",
  },
  // Add profile-related fields
  profileImage: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  interestedCategories: {
    type: [String],
    default: [],
  },
  // Add notification preferences
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  orderUpdates: {
    type: Boolean,
    default: true,
  },
  promotions: {
    type: Boolean,
    default: false,
  },
  newsletter: {
    type: Boolean,
    default: false,
  },
  // Add timestamps for created/updated
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;
