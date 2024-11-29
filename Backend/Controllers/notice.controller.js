import multer from "multer";
import fs from "fs";
import Notice from "../Schemas/Notices.model.js";

// Ensure the directory exists
const ensureDirExists = (dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
};

// Configure Multer Storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = "Notices/";
		ensureDirExists(dir);
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

// Initialize Multer
const upload = multer({ storage }).single("file");

// Upload Notice Function
export const uploadNotice = async (req, res) => {
	upload(req, res, async (err) => {
		if (err) {
			console.error(`Multer Error: ${err.message}`);
			return res.status(500).json({ message: "File upload failed" });
		}

		try {
			const warden = req.warden;

			if (!warden) {
				return res
					.status(401)
					.json({ message: "Unauthorized - No Warden Provided" });
			}

			const { title, description } = req.body;

			if (!title || !description) {
				return res
					.status(400)
					.json({ message: "Title and Description are required" });
			}

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

			res.status(200).json({
				message: "Notice uploaded successfully",
				notice,
			});
			console.log("Notice uploaded successfully");
		} catch (error) {
			console.error(`Error: ${error.message}`);
			res.status(500).json({ message: "Server Error" });
		}
  });
};
