import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import crypto from "crypto";

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

// app.get('*', (req, res) => {
//     res.status(404).send('404: Page not found');
// });

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/warden", wardenRouter);
app.use("/api/hostler", hostlerRouter);

app.listen(PORT, (req, res) => {
	console.log(`listening at port http://localhost:${PORT}`);
	console.log(`env: ${process.env.NODE_ENV}`);
	// const secretKey = crypto.randomBytes(32).toString('hex');
	// console.log(secretKey);
	ConnectDB();
});
