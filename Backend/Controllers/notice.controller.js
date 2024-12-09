import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Notice from "../Schemas/Notices.model.js";

// Ensure the directory exists
const ensureDirExists = (dir) => {
	try {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
	} catch (err) {
		console.error(`Error ensuring directory exists: ${err.message}`);
		throw err;
	}
};

// Configure Multer Storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = "Notices/";
		try {
			ensureDirExists(dir);
			cb(null, dir);
		} catch (err) {
			cb(err);
		}
	},
	filename: (req, file, cb) => {
		const uniqueName = `${uuidv4()}-${file.originalname}`;
		cb(null, uniqueName);
	},
});

// Initialize Multer
const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Max file size of 10MB
	fileFilter: (req, file, cb) => {
		// Accept only PDFs or modify as needed
		if (!file.mimetype.startsWith("application/pdf")) {
			return cb(new Error("Only PDF files are allowed"), false);
		}
		cb(null, true);
	},
}).single("file");

// Upload Notice Function
export const uploadNotice = async (req, res) => {
	upload(req, res, async (err) => {
		if (err instanceof multer.MulterError) {
			// Handle Multer-specific errors (e.g., file size limit exceeded)
			console.error(`Multer Error: ${err.message}`);
			return res.status(400).json({ message: `Multer Error: ${err.message}` });
		} else if (err) {
			// Handle general errors (e.g., invalid file type)
			console.error(`Error: ${err.message}`);
			return res.status(400).json({ message: `File upload error: ${err.message}` });
		}

		try {
			// const warden = req.warden;

			// if(!warden) {
			// 	return res.status(403).json({ message: "Unauthorized" });
			// }

			const { title, description } = req.body;

			// Validate required fields
			if (!title || !description) {
				return res.status(400).json({ message: "Title and Description are required" });
			}

			// Check if file was uploaded
			if (!req.file) {
				return res.status(400).json({ message: "File is required" });
			}

			// Save notice to the database
			const notice = new Notice({
				title,
				description,
				pdf: req.file.path, // Store the file path
			});

			await notice.save();

			return res.status(200).json({
				message: "Notice uploaded successfully",
				notice,
			});
		} catch (error) {
			console.error(`Server Error: ${error.message}`);
			return res.status(500).json({ message: "Internal Server Error" });
		}
	});
};
