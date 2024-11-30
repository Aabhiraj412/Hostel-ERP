import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import Hostler from "../Schemas/Hostlers.model.js";
import PrivateGrivance from "../Schemas/PrivateGrivance.model.js";
import PublicGrivance from "../Schemas/PublicGrivance.model.js";
import { generateHostlerToken } from "../Utils/GenerateToken.utils.js";
import Leave from "../Schemas/Leave.model.js";

export const getHostlers = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden) {
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });
		}

		const hostlers = await Hostler.find().sort({gender: 1},{room_no:1});
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

		const { room } = req.body;

		if (!room) return res.status(400).json({ message: "Invalid Room" });

		const id = req.params.id;

		const hostler = await Hostler.findByIdAndUpdate(
			id,
			{ room_no: room },
			{ new: true }
		);
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
				text: ` Hello ${name},
You have successfully registered in the Hostel Management System.
Your details are as follows:

Name:           ${name}
Roll Number:    ${roll_no}
Aadhar Number:  ${aadhar}
Phone Number:   ${phone_no}
Email:          ${email}
Address:        ${address}
Fathers Name:   ${fathers_name}
Mothers Name:   ${mothers_name}
Address:        ${address}
Year:           ${year}
College:        ${college}
Hostel:         ${hostel}
Room No:        ${room_no}

You can now login to the system using your phone number as the userid and your temperary password.
                
Userid:             ${phone_no} 
Temporary Password: ${password}
                
You need to set your Password and fill rest of the required fields
                
Have a Nice Day`,
			};

            await newHostler.save();
            
			try {
                console.log(process.env.Email)
                console.log(process.env.Pass);
				const emailResponse = await new Promise((resolve, reject) => {
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) reject(error);
						else resolve(info.response);
					});
				});
                console.log("Email sent:", emailResponse);
            }
            catch (emailError) {
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

        if(!warden)
            return res.status(401).json({message: "Unauthorised-no Warden Provided"});

        const leaves = await Leave.find().sort({createdAt: -1});

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

        if(!warden)
            return res.status(401).json({message: "Unauthorised-no Warden Provided"});

        const { status } = req.body;

        if(!status)
            return res.status(400).json({ message: "Status is required" });

        const leave = await Leave.findById(req.params.id);
        
        if(!leave)
            return res.status(404).json({ message: "Leave not found" });
        
        if(status === leave.status) {
            return res.status(400).json({ message: "Status is same as current status" });
        }
        // const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });

        leave.status = status

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
            console.log(process.env.Email)
            console.log(process.env.Pass);
            const emailResponse = await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) reject(error);
                    else resolve(info.response);
                });
            });
            console.log("Email sent:", emailResponse);
        }
        catch (emailError) {
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