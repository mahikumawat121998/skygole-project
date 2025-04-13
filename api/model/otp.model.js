const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobile: {
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
  refreshToken: {
    type: String, // Store refresh token
    default: null,
  },
  otp: { type: String, default: null },
  expiresAt: { type: Date, default: null },
  failedAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
});
const Otp = mongoose.model("Otp", otpSchema);
module.exports = { Otp };
