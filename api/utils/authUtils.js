const jwt = require("jsonwebtoken");

const generateAccessToken = (params) => {
  console.log("Generating access", params);
  const { _id, username, role, isAdmin } = params;
  const accessToken = jwt.sign(
    { id: _id, username, role, isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  return accessToken;
};

const generateRefreshToken = (params) => {
  const { username, role, isAdmin } = params;
  const refreshToken = jwt.sign(
    { username, role, isAdmin },
    process.env.REFRESH_TOKEN_SECRET
  );
  return refreshToken;
};

module.exports = { generateAccessToken, generateRefreshToken };
