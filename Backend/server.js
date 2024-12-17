import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import ConnectDB from "./DataBase/ConnectDB.js";
import authRouter from "./Routes/Auth.routes.js";
import wardenRouter from "./Routes/Warden.routes.js";
import hostlerRouter from "./Routes/Hostler.routes.js";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins
const allowedOrigins = [
	"http://localhost:5173", // Development frontend
	"https://hostelerp.com", // Production frontend or app deep linking
];

// CORS Configuration
const corsOptions = {
	origin: (origin, callback) => {
		// Allow requests with no origin (like mobile apps or Postman)
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
	allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
	exposedHeaders: ["Set-Cookie"], // Expose cookies to the client
	credentials: true, // Allow cookies
};

app.use(cors(corsOptions));

// Middleware for handling preflight requests explicitly
app.options("*", cors(corsOptions));

// Parsing middleware
app.use(express.json({ limit: "50mb" })); // For JSON payloads
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // For URL-encoded payloads
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
	res.send("Hello World!");
});

// Routers
app.use("/api/auth", authRouter);
app.use("/api/warden", wardenRouter);
app.use("/api/hostler", hostlerRouter);

// Error handler for invalid CORS origins
app.use((err, req, res, next) => {
	if (err.message === "Not allowed by CORS") {
		res.status(403).send({ error: "CORS policy does not allow this origin" });
	} else {
		next(err);
	}
});

// Start server
app.listen(PORT, () => {
	console.log(`listening at port http://localhost:${PORT}`);
	console.log(`env: ${process.env.NODE_ENV}`);
	ConnectDB();
});
