import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import Hostler from "../Schemas/Hostlers.model.js";
import PrivateGrivance from "../Schemas/PrivateGrivance.model.js";
import PublicGrivance from "../Schemas/PublicGrivance.model.js";
import Leave from "../Schemas/Leave.model.js";
import OutRegister from "../Schemas/OutRegister.model.js";
import Attendance from "../Schemas/Attendance.model.js";

export const getHostlers = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden) {
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });
		}

		const hostlers = await Hostler.find().sort(
			{ room_no: 1 },
			{ hostel: 1 },
		);
		res.status(200).json(hostlers);
		console.log("Hostlers details fetched successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const gethostler = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const id = req.params.id;

		const hostler = await Hostler.findById(id);

		if (!hostler) {
			return res.status(404).json({ message: "Hostler not found" });
		}

		res.status(200).json(hostler);
		console.log("Hostler details fetched successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const updateRoom = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const { hostel, room } = req.body;

		if (!room || !hostel)
			return res.status(400).json({ message: "Invalid Room" });

		const id = req.params.id;

		const check = await Hostler.find({ room_no: room, hostel: hostel });

		if (check.length > 1)
			return res.status(400).json({ message: "Room already taken" });

		const hostler = await Hostler.findById(id);

		if (hostler.room_no === room)
			return res.status(400).json({ message: "Room not changed" });

		const pre = {
			room_no: hostler.room_no,
			hostel: hostler.hostel,
		};

		hostler.hostel = hostel;
		hostler.room_no = room;

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
			subject: "Room Updated",
			text: `Hello ${hostler.name},

Your room has been updated to form ${pre.hostel} ${pre.room_no} to ${hostel} ${room}. 

Please check your room details.

Thank you.
Regards,
Hostel Management System`,
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

		res.status(200).json(hostler);
		console.log("Room updated successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const getPublicGrievances = async (req, res) => {
	try {
		const grievances = await PublicGrivance.find({}).sort({ date: -1 });
		res.status(200).json(grievances);
		console.log("Public Grievances fetched successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const getPrivateGrievances = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const grievances = await PrivateGrivance.find({}).sort({ date: -1 });
		res.status(200).json(grievances);
		console.log("Private Grievances fetched successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const setPublicGrievance = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const id = req.params.id;

		const grievance = await PublicGrivance.findById(id);

		const { status } = req.body;

		if (!status || !["Pending", "Resolved", "Cancelled"].includes(status))
			return res.status(400).json({ message: "Invalid Status" });

		grievance.status = status;

		await grievance.save();

		res.status(200).json(grievance);
		console.log("Public Grievance status updated successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const setPrivateGrievance = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const id = req.params.id;

		const grievance = await PrivateGrivance.findById(id);

		const { status } = req.body;

		if (!status || !["Pending", "Resolved", "Cancelled"].includes(status))
			return res.status(400).json({ message: "Invalid Status" });

		grievance.status = status;

		await grievance.save();

		res.status(200).json(grievance);
		console.log("Private Grievance status updated successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const addHostler = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden) {
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });
		}

		const {
			name,
			roll_no,
			aadhar,
			gender,
			fathers_name,
			mothers_name,
			phone_no,
			email,
			address,
			year,
			college,
			hostel,
			room_no,
			password,
			confirm_password,
		} = req.body;

		if (
			!name ||
			!roll_no ||
			!aadhar ||
			!gender ||
			!fathers_name ||
			!mothers_name ||
			!phone_no ||
			!email ||
			!address ||
			!year ||
			!college ||
			!hostel ||
			!room_no ||
			!password ||
			!confirm_password
		) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (password.length < 6) {
			return res.status(400).json({
				message: "Password should be at least 6 characters long",
			});
		}

		if (password !== confirm_password) {
			return res.status(400).json({ message: "Password do not match" });
		}

		const newroll_no = await Hostler.findOne({ roll_no });
		const newphone = await Hostler.findOne({ phone_no });
		const newemail = await Hostler.findOne({ email });
		const newaadhar = await Hostler.findOne({ aadhar });

		if (newroll_no)
			return res
				.status(400)
				.json({ message: "Roll number already exists" });

		if (newphone)
			return res
				.status(400)
				.json({ message: "Phone number already exists" });

		if (newemail)
			return res.status(400).json({ message: "Email already exists" });

		if (newaadhar)
			return res
				.status(400)
				.json({ message: "Aadhar number already exists" });

		const inroom = await Hostler.find({ hostel: hostel, room_no: room_no });

		if (inroom.length > 1)
			return res
				.status(400)
				.json({ message: "Room is already occupied" });

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newHostler = new Hostler({
			name,
			roll_no,
			aadhar,
			gender,
			fathers_name,
			mothers_name,
			phone_no,
			email,
			address,
			year,
			college,
			hostel,
			room_no,
			temp_pass: hashedPassword,

			password: " ",
			date_of_birth: " ",
			blood_group: " ",
			local_guardian: " ",
			local_guardian_phone: " ",
			local_guardian_address: " ",
			fathers_no: " ",
			mothers_no: " ",
			fathers_email: " ",
			mothers_email: " ",
			course: " ",
			branch: " ",

			privete_grivance: [],
			public_grivance: [],
			outregister: [],
			Leave: [],
			present_on: [],
			absent_on: [],
		});

		if (newHostler) {
			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.Email,
					pass: process.env.Pass,
				},
			});

			const mailOptions = {
				from: process.env.Email,
				to: email,
				subject: "Registration in Hostel",
				text: `Hello ${name},

You have successfully registered in the Hostel Management System.
Your details are as follows:

Name: ${name}
Roll Number: ${roll_no}
Aadhar Number: ${aadhar}
Phone Number: ${phone_no}
Email: ${email}
Address: ${address}
Fathers Name: ${fathers_name}
Mothers Name: ${mothers_name}
Address: ${address}
Year: ${year}
College: ${college}
Hostel: ${hostel}
Room No: ${room_no}

You can now login to the system using your phone number as the userid and your temperary password.
                
Userid:             ${phone_no} 
Temporary Password: ${password}
                
You need to set your Password and fill rest of the required fields
                
Have a Nice Day`,
			};

			await newHostler.save();

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

			res.status(201).json(newHostler);

			console.log("Hostler registered successfully");
		}
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const getLeaves = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const leaves = await Leave.find().sort({ createdAt: -1 });

		res.json(leaves);

		console.log("Leaves fetched successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const setLeaves = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const { status } = req.body;

		if (!status)
			return res.status(400).json({ message: "Status is required" });

		const leave = await Leave.findById(req.params.id);

		if (!leave) return res.status(404).json({ message: "Leave not found" });

		if (status === leave.status) {
			return res
				.status(400)
				.json({ message: "Status is same as current status" });
		}

		leave.status = status;

		const student = await Hostler.findById(leave.student);

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.Email,
				pass: process.env.Pass,
			},
		});

		const mailOptions = {
			from: process.env.Email,
			to: student.email,
			subject: "Update on Leave Status",
			text: `Hello ${student.name},

It is to notify you that your application for the leave of ${leave.days} days from ${leave.from} to ${leave.to} for purpose of ${leave.reason} has been ${status}.         

If you have any further queries, please do not hesitate to contact us.
            
Have a Nice Day`,
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

		await leave.save();

		res.json(leave);

		console.log("Leave status updated successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const getOutRegister = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const outRegister = await OutRegister.find().sort({ createdAt: -1 });

		res.json(outRegister);

		console.log("OutRegister fetched successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const removeHostler = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const hostler = await Hostler.findByIdAndDelete(req.params.id);

		if (!hostler)
			return res.status(404).json({ message: "Hostler not found" });

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
			subject: "Hostler Removed",
			text: `Hello ${hostler.name},
			
We are informing you that your hostel account has been removed from our system. 
			
If you have any further queries, please do not hesitate to contact us.

Have a Nice Day`,
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

		res.json(hostler);
		console.log("Hostler deleted successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const getAttendance = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const { hostel, date } = req.body;

		if (!hostel || !date)
			return res
				.status(400)
				.json({ message: "Hostel and Date are required" });

		const hostlers = await Hostler.find({ hostel }).sort({ room_no: 1 });

		if (!hostlers || hostlers.length === 0)
			return res
				.status(404)
				.json({ message: `Hostlers not found in ${hostel} Hostel` });

		const [day, month, year] = date.split("-"); // Split by the hyphen to extract day, month, and year

		// Convert the input date to ISO format and set time to midnight to compare only the date
		const iso = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Month is 0-indexed
		const getdate = iso.toISOString().split("T")[0]; // Extract YYYY-MM-DD from the ISO string

		const getDateOnly = (dateString) => {
			const date = new Date(dateString);
			date.setHours(0, 0, 0, 0); // Set the time to midnight
			return date.toISOString().split("T")[0]; // Return only the YYYY-MM-DD part
		};

		const present = hostlers.filter((hostler) =>
			hostler.present_on?.some(
				(attendanceDate) =>
					getDateOnly(attendanceDate.toISOString()) === getdate
			)
		);

		const absent = hostlers.filter((hostler) =>
			hostler.absent_on?.some(
				(attendanceDate) =>
					getDateOnly(attendanceDate.toISOString()) === getdate
			)
		);

		res.json({ present, absent });

		console.log("Attendance fetched successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const saveAttendence = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });

		const { students } = req.body;

		if (!students)
			return res.status(400).json({ message: "Students are required" });

		console.log("Students: ", students);
		// Check if an IP record already exists
		let attendanceRecord = await Attendance.findOne(); // Get the first matching IP record

		if (!attendanceRecord) {
			attendanceRecord = new Attendance({ hostler: students });
		} else {
			for (const student of students) {
				if (!attendanceRecord.hostler.includes(student))
					attendanceRecord.hostler.push(student);
			}
		}

		await attendanceRecord.save();
		console.log("Attendance marked successfully");
		res.status(200).json(attendanceRecord);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const markAttendence = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden)
			return res
				.status(401)
				.json({ message: "Unauthorized - No Warden Provided" });

		const attendance = await Attendance.findOne();

		const presentHostlers = attendance.hostler;

		const hostlers = await Hostler.find().sort({ room_no: 1 });

		const date = new Date();
		const attendanceDate = date.toLocaleDateString("en-CA", {
			timeZone: "Asia/Kolkata",
		});

		console.log("Attendance Date: ", attendanceDate);

		var present = [];
		for (const hostler of hostlers) {
			
			if(presentHostlers.includes(hostler._id)){
				present.push(hostler);
				console.log(hostler.name)
				hostler.present_on.push(attendanceDate);
			}
			await hostler.save();
		}
		attendance.hostler = [];
		await attendance.save();
		res.json(present);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};
