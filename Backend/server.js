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
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.31.175:8081",
  "https://hostelerp.com",
  "https://hostel-erp.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Incoming Origin:", origin); // Debug log

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

// Helmet Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP to avoid interference
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Force CORS Headers Middleware (Extra Safety)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Test Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/warden", wardenRouter);
app.use("/api/hostler", hostlerRouter);

// Handle CORS errors
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy does not allow this origin" });
  }
  next(err);
});

// Handle Unhandled Routes
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  ConnectDB();
});
