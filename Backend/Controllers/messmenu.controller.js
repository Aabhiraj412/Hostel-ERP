import multer from "multer";
import Menu from "../Schemas/Menu.model.js";

// Use memoryStorage to handle file data in memory
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
	fileFilter: (req, file, cb) => {
		// Accept only PNG files or adjust as needed
		if (!file.mimetype.startsWith("image/png")) {
			return cb(new Error("Only PNG files are allowed"), false);
		}
		cb(null, true);
	},
}).single("file");

export const uploadMessMenu = async (req, res) => {

	const warden = req.warden;

	if (!warden)
		return res
            .status(401)
            .json({ message: "Unauthorized - No Warden Provided" });

	upload(req, res, async (err) => {
		if (err instanceof multer.MulterError) {
			console.error(`Multer Error: ${err.message}`);
			return res
				.status(400)
				.json({ message: `Multer Error: ${err.message}` });
		} else if (err) {
			console.error(`Error: ${err.message}`);
			return res
				.status(400)
				.json({ message: `File upload error: ${err.message}` });
		}

		try {
			// Check if a file was uploaded
			if (!req.file) {
				return res.status(400).json({ message: "File is required" });
			}

			// Check if a menu already exists in the database
			let menu = await Menu.findOne();

			if (menu) {
				// Update the existing record
				menu.menu = req.file.buffer;
				menu.contentType = req.file.mimetype;
				await menu.save();
				return res
					.status(200)
					.json({ message: "Mess Menu updated successfully" });
			} else {
				// Create a new record
				menu = new Menu({
					menu: req.file.buffer,
					contentType: req.file.mimetype,
				});
				await menu.save();
				return res
					.status(200)
					.json({ message: "Mess Menu uploaded successfully" });
			}
		} catch (error) {
			console.error(`Server Error: ${error.message}`);
			res.status(500).json({ message: "Internal Server Error" });
		}
	});
};

export const getMessMenu = async (req, res) => {
	try {
		// Fetch the menu from the database
		const menu = await Menu.findOne();

		if (!menu) {
			return res.status(404).json({ message: "No Mess Menu found" });
		}

		// Set the appropriate content type and send the binary data
		res.set("Content-Type", menu.contentType);
		res.send(menu.menu);
		console.log("Mess Menu fetched successfully");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
