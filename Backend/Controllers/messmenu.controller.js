import multer from "multer";
import fs from "fs";

// Ensure the directory exists
const ensureDirExists = (dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
};

// Configure Multer Storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = "Mess Menu/";
		ensureDirExists(dir);
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		cb(null, `Mess Menu.png`);
	},
});

// Initialize Multer
const upload = multer({ storage }).single("file");

// Upload mess menu Function
export const uploadMessMenu = async (req, res) => {
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

			if (!req.file) {
				return res.status(400).json({ message: "File is required" });
			}

			res.status(200).json({
				message: "Mess Menu uploaded successfully"
			});
			console.log("Mess Menu uploaded successfully");
		} catch (error) {
			console.error(`Error: ${error.message}`);
			res.status(500).json({ message: "Server Error" });
		}
  });
};

export const getMessMenu = async (req, res) => {
    try {
        const menu = '/Mess Menu/Mess Menu.png'; // Make sure this is a valid path
        // res.status(200).json({ url: menu }); // Send the URL as a JSON response
		res.sendFile(menu, { root: '.' });
        console.log("Mess Menu fetched successfully");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}
	export const getNotice = async (req, res) => {
    try {
        // const menu = '/Mess Menu/Mess Menu.png';
		const path = `/Notices/${req.params.path}`;
		// console.log(path);
        res.status(200).sendFile(path, { root: '.' });
        console.log("Mess Menu fetched successfully");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}