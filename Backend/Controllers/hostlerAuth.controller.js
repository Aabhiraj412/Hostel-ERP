import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import Hostler from "../Schemas/Hostlers.model.js";
import { generateHostlerToken } from "../Utils/GenerateToken.utils.js";

export const hostlerlogin = async (req, res) => {
	try {
		const { user, password } = req.body;

		if (!user || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const newuser = await Hostler.findOne({
			$or: [
				{ roll_no: user },
				{ phone_no: user },
				{ email: user },
				{ aadhar: user },
			],
		});

		if (!newuser) {
			return res.status(400).json({ message: "Invalid Credentials" });
		}

		const isMatch = await bcrypt.compare(password, newuser.password);

		const tempMatch = await bcrypt.compare(password, newuser.temp_pass);

		if (!isMatch && !tempMatch) {
			return res.status(400).json({ message: "Invalid Credentials" });
		}

		if (tempMatch && newuser.password != " ") {
			return res.status(400).json({ message: "Invalid Credentials" });
		}

		generateHostlerToken(newuser._id, res);

		res.status(200).json(newuser);

		console.log("Hostler logged in successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const hostlerlogout = (req, res) => {
	res.clearCookie("jwt", { path: "/" });
	res.status(200).json({ message: "Logged out successfully" });
};

export const addDetails = async (req, res) => {
	try {
		const hostler = req.hostler;

		if (!hostler) {
			return res
				.status(401)
				.json({ message: "Unauthorised-no Hostler Provided" });
		}

		const {
			date_of_birth,
			blood_group,
			local_guardian,
			local_guardian_phone,
			local_guardian_address,
			fathers_no,
			mothers_no,
			fathers_email,
			mothers_email,
			course,
			branch,
		} = req.body;

		if (
			!date_of_birth ||
			!blood_group ||
			!local_guardian ||
			!local_guardian_phone ||
			!local_guardian_address ||
			!fathers_no ||
			!mothers_no ||
			!fathers_email ||
			!mothers_email ||
			!course ||
			!branch
		) {
			return res.status(400).json({ message: "All fields are required" });
		}

		hostler.date_of_birth = date_of_birth;
		hostler.blood_group = blood_group;
		hostler.local_guardian = local_guardian;
		hostler.local_guardian_phone = local_guardian_phone;
		hostler.local_guardian_address = local_guardian_address;
		hostler.fathers_no = fathers_no;
		hostler.mothers_no = mothers_no;
		hostler.fathers_email = fathers_email;
		hostler.mothers_email = mothers_email;
		hostler.course = course;
		hostler.branch = branch;

		await hostler.save();
		res.status(200).json(hostler);

		console.log("Details added successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const getHostler = async (req, res) => {
	try {
		const hostler = req.hostler;
		res.status(200).json(hostler);
		console.log("Hostler details fetched successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const forgetPass = async (req, res) => {
	try {
		const { user } = req.body;

		if (!user) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const hostler = await Hostler.findOne({
			$or: [
				{ roll_no: user },
				{ phone_no: user },
				{ email: user },
				{ aadhar: user },
			],
		});

		if (!hostler) {
			return res.status(400).json({ message: "Invalid Credentials" });
		}

		const temp_pass = Math.floor(
			100000 + Math.random() * 900000
		).toString();

		const salt = await bcrypt.genSalt(10);
		const temp_password = await bcrypt.hash(temp_pass, salt);
		hostler.temp_pass = temp_password;
		hostler.password = " ";

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.Email,
				pass: process.env.Pass,
			},
		});
		const mailOptions = {
			from: process.env.Email,
			to: hostler.email,
			subject: "Password Reset",
			text: `Hello ${hostler.name},

It is to notify you that on your request a Temperary Password is Generated for you which is : ${temp_pass}.

It is advised to change your password after logging in.

Thank You
Hostel ERP`,
		};

		try {
			const emailResponse = await new Promise((resolve, reject) => {
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) reject(error);
					else resolve(info.response);
				});
			});
			console.log("Email sent:", emailResponse);
		} catch (emailError) {
			console.error("Failed to send email:", emailError.message);
			return res.status(500).json({ error: "Failed to send email." });
		}

		await hostler.save();
		res.status(200).json({
			message: "Temporary password sent to your email",
		});

		console.log("Temporary password sent successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};
