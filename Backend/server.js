import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import ConnectDB from "./DataBase/ConnectDB.js";
import authRouter from "./Routes/Auth.routes.js";
import wardenRouter from "./Routes/Warden.routes.js";
import hostlerRouter from "./Routes/Hostler.routes.js";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173",
      "https://hostelerp.com",
      "https://hostel-erp.vercel.app",
    ];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight handling

// Middleware
app.use(helmet()); // Security middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routers
app.use("/api/auth", authRouter);
app.use("/api/warden", wardenRouter);
app.use("/api/hostler", hostlerRouter);

// Handle CORS errors
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).send({ error: "CORS policy does not allow this origin" });
  } else {
    next(err);
  }
});

// Handle unhandled routes
app.use("*", (req, res) => {
  res.status(404).send({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send({ error: err.message || "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  ConnectDB();
});
