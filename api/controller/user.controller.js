const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateOTP = require("../utils/generateOtp.js");
const getEmailTemplate = require("../utils/emailTemplate.js");
const sendEmail = require("../utils/sendEmail.js");
const { Otp } = require("../model/otp.model.js");
const { responseMessages } = require("../constants/responseMessage.js");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/authUtils.js");
const { User } = require("../model/user.model.js");

const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, password, isAdmin } = req.body;

    // Generate username
    const username = `${firstName.toLowerCase()}${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    console.log("Generated Username:", username);

    const otp = generateOTP();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000 + istOffsetMs);

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const htmlEmailTemplate = getEmailTemplate(username, otp);
    await sendEmail(email, "Verify Your OTP Code", htmlEmailTemplate);

    const tempUser = new Otp({
      username,
      firstName,
      lastName,
      email,
      mobile,
      password: hashPassword,
      isAdmin,
      otp,
      expiresAt,
    });

    await tempUser.save();

    return res.status(responseMessages.STATUS.CREATED).json({
      status: responseMessages.STATUS.CREATED,
      data: {
        username,
        firstName,
        lastName,
        email,
        isAdmin,
        otp,
        expiresAt,
      },
      message: responseMessages.SUCCESS.USER_CREATED,
    });
  } catch (error) {
    return res.status(responseMessages.STATUS.SERVER_ERROR).json({
      message: responseMessages.ERROR.INTERNAL_SERVER,
      error: error.message,
    });
  }
};

const otpVerification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const existing = await Otp.findOne({ email });
    const {
      username,
      password,
      refreshToken,
      isAdmin,
      firstName,
      lastName,
      mobile,
    } = existing;
    if (!existing)
      return res.status(400).json({
        message: responseMessages.ERROR.OTP_NOTFOUND,
      });
    if (existing.otp != otp)
      return res.status(400).json({
        message: responseMessages.ERROR.OTP_INVALID,
      });
    const istOffsetMs = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const now = new Date(Date.now() + istOffsetMs);

    if (now > existing.expiresAt) {
      return res.status(400).json({
        message: responseMessages.ERROR.OTP_EXPIRED,
      });
    }
    // Save to users
    await User.create({
      username,
      password,
      refreshToken,
      isAdmin,
      email,
      firstName,
      lastName,
      mobile,
    });
    // Delete OTP
    await Otp.deleteOne({ email });
    return res.status(201).json({
      status: responseMessages.STATUS.OK,
      data: {},
      message: responseMessages.ERROR.OTP_VERIFIED,
    });
  } catch (error) {
    return res.status(responseMessages.STATUS.SERVER_ERROR).json({
      message: responseMessages.ERROR.INTERNAL_SERVER,
      error: error.message,
    });
  }
};

const otpResend = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("🚀 ~ otpResend ~ email:", email);
    const otp = generateOTP();
    // const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min validity
    const istOffsetMs = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000 + istOffsetMs);
    const result = await Otp.updateOne({ email }, { $set: { otp, expiresAt } });
    console.log("🚀 ~ otpResend ~ result:", result);

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or OTP not updated" });
    }
    return res.status(201).json({
      status: responseMessages.STATUS.CREATED,
      data: { otp },
      message: responseMessages.SUCCESS.NEW_OTP_CREATED,
    });
  } catch (error) {
    return res.status(responseMessages.STATUS.SERVER_ERROR).json({
      message: responseMessages.ERROR.INTERNAL_SERVER,
      error: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const istOffsetMs = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const currentTime = new Date(Date.now() + istOffsetMs);
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({
          message: responseMessages.ERROR.INVALID_CREDENTIALS,
          status: 401,
        });
    }
    // Check if account is locked
    if (user.lockUntil && user.lockUntil > currentTime) {
      const minutesLeft = Math.ceil((user.lockUntil - currentTime) / 60000);
      return res.status(403).json({
        message: `Too many attempts. Please try again after ${minutesLeft} minutes.`,
      });
    }
    // Compare hashed passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      let updates = { $inc: { failedAttempts: 1 } };
      if (user.failedAttempts + 1 >= 3) {
        updates = {
          $set: {
            lockUntil: new Date(currentTime.getTime() + 3 * 60 * 60 * 1000), // 3 hours
          },
        };
      }
      await User.updateOne({ email }, updates);
      return res
        .status(400)
        .json({
          status: 400,
          message:
            user.failedAttempts + 1 >= 3
              ? `${responseMessages.ERROR.TOO_MANY_ATTEMPTS}`
              : `${responseMessages.ERROR.INVALID_CREDENTIALS}`,
        });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in the database
    await User.updateOne(
      { email },
      { $set: { failedAttempts: 0, lockUntil: null, refreshToken } }
    );

    // Send response
    return res.status(200).json({
      status: responseMessages.STATUS.CREATED,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
        accessToken,
        refreshToken,
      },
      message: responseMessages.SUCCESS.USER_CREATED,
    });
  } catch (error) {
    return res.status(responseMessages.STATUS.SERVER_ERROR).json({
      message: responseMessages.ERROR.INTERNAL_SERVER,
      error: error.message,
    });
  }
};

const userResetPassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "New password must be at least 6 characters long.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password and confirm password do not match.",
    });
  }

  try {
    const username = req.user.username; // Extracted from access token
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { username },
      { $set: { password: hashedPassword } }
    );

    return res.status(200).json({
      status: responseMessages.STATUS.OK,
      data: {},
      message: responseMessages.ERROR.PASSWORD_UPDATED,
    });
  } catch (error) {
    return res.status(responseMessages.STATUS.SERVER_ERROR || 500).json({
      message: responseMessages.ERROR.INTERNAL_SERVER || "Something went wrong.",
      error: error.message,
    });
  }
};


const getUserDetails = async (req, res) => {
  const { username } = req.user;
  try {
    if (username) {
      const user = await User.findOne({ username });
      return res.status(200).json({
        status: responseMessages.STATUS.OK,
        data: { user },
        message: responseMessages.SUCCESS.USERS_GET_SUCCESSFULLY,
      });
    }
  } catch (error) {
    return res.status(responseMessages.STATUS.SERVER_ERROR).json({
      message: responseMessages.ERROR.INTERNAL_SERVER,
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  console.log(
    "req.user.id === req.params.userId || req.user.isAdmin",
    req.user.id,
    req.params.userId,
    req.user.isAdmin
  );
  try {
    if (req.user.id === req.params.userId) {
      const userId = req.params.userId;
      const { username } = req.body;
      await User.deleteOne({ _id: userId });
    }

    return res.status(200).json({
      status: responseMessages.STATUS.OK,
      data: {},
      message: responseMessages.SUCCESS.USER_DELETED,
    });
  } catch (error) {
    return res.status(500).json({
      message: responseMessages.ERROR.INTERNAL_SERVER,
      error: error.message,
    });
  }
};

const refreshTokens = async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded = jwt.decode(refreshToken);
    const user = await User.findOne({ username: decoded.username });
    if (user.refreshToken === refreshToken) {
      const accessToken = generateAccessToken(decoded);
      const updatedNewRefreshToken = generateRefreshToken(decoded);
      const modifiedUserToken = await User.updateOne(
        { username: decoded.username },
        { refreshToken: updatedNewRefreshToken }
      );
      if (modifiedUserToken.modifiedCount == 1) {
        return res.status(200).json({
          status: responseMessages.STATUS.CREATED,
          data: { accessToken, updatedNewRefreshToken },
          message: responseMessages.SUCCESS.TOKENS,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: responseMessages.ERROR.INTERNAL_SERVER,
      error: error.message,
    });
  }
};

module.exports = {
  userLogin,
  deleteUser,
  refreshTokens,
  userRegister,
  otpVerification,
  userResetPassword,
  getUserDetails,
  otpResend,
};
