const responseMessages = {
  STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500,
  },
  SUCCESS: {
    USER_CREATED: "User created successfully.",
    PASSWORD_UPDATED: "Password updated successfully.",
    LOGIN_SUCCESS: "Login successful.",
    OTP_VERIFIED: "OTP verified successfully.",
    USER_DELETED: "User deleted successfully",
    NEW_OTP_CREATED: "New OTP has created successfully",
    TOKENS: "Tokens created successfully",
    USERS_GET_SUCCESSFULLY:"User details got successfully"
  },

  ERROR: {
    INTERNAL_SERVER: "Something went wrong on the server.",
    USER_NOT_FOUND: "User not found.",
    USER_NOT_FOUND_OR_PASSWORD: "User not found or password not updated.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    OTP_EXPIRED: "OTP has expired.",
    OTP_INVALID: "Invalid OTP.",
    OTP_NOTFOUND: "No OTP found.",
    UNAUTHORIZED: "Unauthorized access.",
    TOO_MANY_ATTEMPTS: "Too many attempts. Please try again later.",
    VALIDATION_FAILED: "Validation failed. Check input fields.",
    PASSWORD_UPDATED: "Password updated successfully",
  },
};

module.exports = { responseMessages };
