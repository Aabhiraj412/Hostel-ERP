import bcrypt from "bcryptjs";
import Hostler from "../Schemas/Hostlers.model.js";
import { generateHostlerToken } from "../Utils/GenerateToken.utils.js";

// export const hostlerregistration = async (req, res) => {
//   try {
//     const warden = req.warden;

//     if (!warden) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorised-no Warden Provided" });
//     }

//     const {
//       name,
//       roll_no,
//       aadhar,
//       gender,
//       fathers_name,
//       mothers_name,
//       phone_no,
//       email,
//       address,
//       year,
//       college,
//       hostel,
//       room_no,
//       password,
//       confirm_password,
//     } = req.body;

//     if (
//       !name ||
//       !roll_no ||
//       !aadhar ||
//       !gender ||
//       !fathers_name ||
//       !mothers_name ||
//       !phone_no ||
//       !email ||
//       !address ||
//       !year ||
//       !college ||
//       !hostel ||
//       !room_no ||
//       !password ||
//       !confirm_password
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password should be at least 6 characters long" });
//     }

//     if (password !== confirm_password) {
//       return res.status(400).json({ message: "Password do not match" });
//     }

//     const newroll_no = await Hostler.findOne({ roll_no });
//     const newphone = await Hostler.findOne({ phone_no });
//     const newemail = await Hostler.findOne({ email });
//     const newaadhar = await Hostler.findOne({ aadhar });

//     if (newroll_no)
//       return res.status(400).json({ message: "Roll number already exists" });

//     if (newphone)
//       return res.status(400).json({ message: "Phone number already exists" });

//     if (newemail)
//       return res.status(400).json({ message: "Email already exists" });

//     if (newaadhar)
//       return res.status(400).json({ message: "Aadhar number already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newHostler = new Hostler({
//       name,
//       roll_no,
//       aadhar,
//       gender,
//       fathers_name,
//       mothers_name,
//       phone_no,
//       email,
//       address,
//       year,
//       college,
//       hostel,
//       room_no,
//       temp_pass: hashedPassword,

//       password: " ",
//       date_of_birth: " ",
//       blood_group: " ",
//       local_guardian: " ",
//       local_guardian_phone: " ",
//       local_guardian_address: " ",
//       fathers_no: " ",
//       mothers_no: " ",
//       fathers_email: " ",
//       mothers_email: " ",
//       course: " ",
//       branch: " ",

//       privete_grivance: [],
//       public_grivance: [],
//       outregister: [],
//       Leave: [],
//       present_on: [],
//       absent_on: [],
//     });

//     if (newHostler) {
//       generateHostlerToken(newHostler._id, res);

//       await newHostler.save();

//       res.status(201).json(newHostler);

//       console.log("Hostler registered successfully");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

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
