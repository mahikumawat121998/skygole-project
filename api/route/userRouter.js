const express = require("express");
const { verify } = require("../middleware/auth.middleware.js");
const { strictLimiter } = require("../utils/rateLimiter");

const router = express.Router();
const {
  userLogin,
  deleteUser,
  refreshTokens,
  userRegister,
  otpVerification,
  userResetPassword,
  getUserDetails,
  otpResend
} = require("../controller/user.controller.js");
// Using registration router to store user details temporally inside otp collection once user verified saving all details inside user collection
router.post("/registration", userRegister); 
router.post("/otp-verification", strictLimiter, otpVerification);
router.patch("/resend-otp", otpResend);
router.post("/login", strictLimiter, userLogin);
router.patch("/reset-password", verify, userResetPassword);
router.get("/", verify, getUserDetails);
router.delete("/delete/:userId", verify, deleteUser);
router.post("/refresh", refreshTokens);

module.exports = router;
