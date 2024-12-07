import multer from "multer";
import Notice from "../Schemas/Notices.model.js";

// Configure Multer Storage (Memory)
const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Max file size of 10MB
	fileFilter: (req, file, cb) => {
		if (!file.mimetype.startsWith("application/pdf")) {
			return cb(new Error("Only PDF files are allowed"), false);
		}
		cb(null, true);
	},
}).single("file");

// Upload Notice Function
export const uploadNotice = async (req, res) => {
	const warden = req.warden;

	if (!warden)
		return res
			.status(401)
			.json({ message: "Unauthorized - No Warden Provided" });

	upload(req, res, async (err) => {
		if (err instanceof multer.MulterError) {
			// Multer-specific errors
			console.error(`Multer Error: ${err.message}`);
			return res
				.status(400)
				.json({ message: `Multer Error: ${err.message}` });
		} else if (err) {
			// General errors
			console.error(`Error: ${err.message}`);
			return res
				.status(400)
				.json({ message: `File upload error: ${err.message}` });
		}

		try {
			const { title, description } = req.body;

			// Validate required fields
			if (!title || !description) {
				return res
					.status(400)
					.json({ message: "Title and Description are required" });
			}

			// Check if file was uploaded
			if (!req.file) {
				return res.status(400).json({ message: "File is required" });
			}

			// Save notice to the database
			const notice = new Notice({
				title,
				description,
				pdf: req.file.buffer, // Store binary data
				contentType: req.file.mimetype, // Store MIME type
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

export const getNotices = async (req, res) => {
	try {
		// Fetch all notices from the database
		const notices = await Notice.find({},{pdf:0}).sort({
			createdAt: -1,
		}); // Exclude the `pdf` field to optimize response

		if (notices.length === 0) {
			return res.status(404).json({ message: "No notices found" });
		}

		return res.status(200).json({
			message: "Notices retrieved successfully",
			notices: notices || [],
		});
	} catch (error) {
		console.error(`Server Error: ${error.message}`);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getNotice = async (req, res) => {
	try {
		const { id } = req.params;

		// Fetch the specific notice by ID
		const notice = await Notice.findById(id);

		if (!notice) {
			return res.status(404).json({ message: "Notice not found" });
		}

		// Set the response headers to serve the PDF file
		res.set("Content-Type", notice.contentType);
		res.send(notice.pdf); // Send the binary data
	} catch (error) {
		console.error(`Server Error: ${error.message}`);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

