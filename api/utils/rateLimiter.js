const rateLimit = require("express-rate-limit");

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //  15 minutes
  max: 100, //  limit each IP to 100 requests per window
  standardHeaders: true, //  Return rate limit info in headers
  legacyHeaders: false, //  Disable `X-RateLimit-*` headers (old format)
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

const strictLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 8,                   // Only 5 attempts allowed per 10 mins
    message: {
      status: 429,
      message: "Too many attempts. Try again in 10 minutes."
    }
  })

module.exports = {apiRateLimiter,strictLimiter};
