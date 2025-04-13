const express = require("express");
const { connection } = require("./connect.js");
const cors = require("cors");
const userRouter = require("./route/userRouter.js");
const unlockExpiredAccounts = require("./cron/unlockUsers");
const { apiRateLimiter } = require("./utils/rateLimiter");

const app = express();
require("dotenv").config();
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",        // for local development (Vite)
  "http://3.107.84.196:5173",     // your deployed client IP (Vite default port)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(apiRateLimiter); // Apply to all routes
app.use("/api/v1/auth", userRouter);
app.get("", (req, res) => {
  res.status(201).json({ name: "Mahesh" });
});
unlockExpiredAccounts();
app.listen(4000, async () => {
  await connection();
  console.log("Server is running on port 4000");
});
