const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  mobile: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String, // Store refresh token
    default: null,
  },
  otp: { type: String, default: null },
  expiresAt: { type: Date, default: null },
  failedAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
});
const User = mongoose.model("User", registerSchema);

module.exports = { User };
