import Hostler from "../Schemas/Hostlers.model.js";
import Notice from "../Schemas/Notices.model.js";
import PrivateGrivance from "../Schemas/PrivateGrivance.model.js";
import PublicGrivance from "../Schemas/PublicGrivance.model.js";

export const publicgrivance = async (req, res) => {
	try {
		const hostler = req.hostler;

		if (!hostler)
			return res
				.status(401)
				.json({ message: "Unauthorised-no Hostler Provided" });

		const { title, description } = req.body;

		if (!title || !description) {
			return res
				.status(400)
				.json({ message: "Title and Description are required" });
		}

		const publicgrivance = new PublicGrivance({
			student: hostler._id,
			title,
			description,
			date: new Date(),
			status: "Pending",
			upvotes: [hostler._id],
		});

        hostler.public_grivance.push(publicgrivance._id);
        
        await hostler.save();
		await publicgrivance.save();
        
		res.status(200).json(publicgrivance);
		console.log("Public Grievance submitted successfully");
		console.log(`Total Upvotes: ${publicgrivance.upvotes.length - 1}`);
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

export const upvote = async (req, res) => {
	try {
		const hostler = req.hostler;

		if (!hostler) {
			return res
				.status(401)
				.json({ message: "Unauthorised-no Hostler Provided" });
		}

		const grievanceId = req.params.id;

		const grievance = await PublicGrivance.findById(grievanceId);

		if (!grievance) {
			return res.status(404).json({ message: "Grievance not found" });
		}

		if (grievance.upvotes.includes(hostler._id)) {
			grievance.upvotes.remove(hostler._id);
			await grievance.save();
			res.status(200).json(grievance);
			console.log("Upvote Removed successfully");
			console.log(`Total Upvotes: ${grievance.upvotes.length - 1}`);
		} else {
			grievance.upvotes.push(hostler._id);
			await grievance.save();
			res.status(200).json(grievance);
			console.log("Grievance upvoted successfully");
			console.log(`Total Upvotes: ${grievance.upvotes.length - 1}`);
		}
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const privateGrievance = async (req, res) => {
    try {
        const hostler = req.hostler;

        if (!hostler)
            return res
                .status(401)
                .json({ message: "Unauthorised-no Hostler Provided" });

        const { title, description } = req.body;

        if (!title || !description) {
            return res
                .status(400)
                .json({ message: "Title and Description are required" });
        }

        const privategrivance = new PrivateGrivance({
            student: hostler._id,
            title,
            description,
            date: new Date(),
            status: "Pending",
        });

        hostler.private_grivance.push(privategrivance._id);

        await hostler.save();
        await privategrivance.save();

        res.status(200).json(privategrivance);
        console.log("Private Grievance submitted successfully");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getPrivateGrievances = async (req, res) => {
    try {
        const hostler = req.hostler;

        if (!hostler)
            return res
               .status(401)
               .json({ message: "Unauthorised-no Hostler Provided" });

        const privateGrievances = await PrivateGrivance.find({ student: hostler._id });

        res.status(200).json(privateGrievances);
        console.log("Private Grievances fetched successfully");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getNotices = async (req, res) => {
    try{
        const notices = await Notice.find({}).sort({date: -1});
        res.status(200).json(notices);
        console.log("Notices fetched successfully");
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message: "Server Error"});
    }
};