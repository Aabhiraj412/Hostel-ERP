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

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use(express.json({ limit: "50mb" })); // For JSON payloads
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // For URL-encoded payloads

app.use(cookieParser());

// Configure CORS to allow all origins
app.use(
	cors({
		origin: "*", // Allow all origins
		credentials: true, // Allow cookies (Optional, requires specific origins)
	})
);

// Remove Access-Control-Allow-Origin header middleware for specific origin
// Allow all origins in response headers
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Credentials", "true"); // Allow cookies
	next();
});

// Routers
app.use("/api/auth", authRouter);
app.use("/api/warden", wardenRouter);
app.use("/api/hostler", hostlerRouter);

app.listen(PORT, () => {
	console.log(`listening at port http://localhost:${PORT}`);
	console.log(`env: ${process.env.NODE_ENV}`);
	ConnectDB();
});
