import Hostler from "../Schemas/Hostlers.model.js";
import PrivateGrivance from "../Schemas/PrivateGrivance.model.js";
import PublicGrivance from "../Schemas/PublicGrivance.model.js";

export const getHostlers = async (req, res) => {
	try {
		const warden = req.warden;

		if (!warden) {
			return res
				.status(401)
				.json({ message: "Unauthorised-no Warden Provided" });
		}

		const hostlers = await Hostler.find();
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

        if(!warden)
            return res.status(401).json({message: "Unauthorised-no Warden Provided"});

        const { room } = req.body;

        if(!room)
            return res.status(400).json({message: "Invalid Room"});

        const id = req.params.id;

        const hostler = await Hostler.findByIdAndUpdate(id, { room_no: room }, { new: true });
        res.status(200).json(hostler);
        console.log("Room updated successfully");
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message: "Server Error"});
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
    try{
        const warden = req.warden;

        if(!warden)
            return res.status(401).json({message: "Unauthorised-no Warden Provided"});

        const grievances = await PrivateGrivance.find({}).sort({date: -1});
        res.status(200).json(grievances);
        console.log("Private Grievances fetched successfully");
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message: "Server Error"});
    }
};

export const setPublicGrievance = async (req, res) => {
    try{

        const warden = req.warden;

        if(!warden)
            return res.status(401).json({message: "Unauthorised-no Warden Provided"});

        const id = req.params.id;

        const grievance = await PublicGrivance.findById(id);

        const {status} = req.body;

        if(!status ||!['Pending', 'Resolved', 'Cancelled'].includes(status))
            return res.status(400).json({message: "Invalid Status"});

        grievance.status = status;

        await grievance.save();

        res.status(200).json(grievance);
        console.log("Public Grievance status updated successfully");

    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message: "Server Error"});
    }
};

export const setPrivateGrievance = async (req, res) => {
    try{

        const warden = req.warden;

        if(!warden)
            return res.status(401).json({message: "Unauthorised-no Warden Provided"});

        const id = req.params.id;

        const grievance = await PrivateGrivance.findById(id);

        const {status} = req.body;

        if(!status ||!['Pending', 'Resolved', 'Cancelled'].includes(status))
            return res.status(400).json({message: "Invalid Status"});

        grievance.status = status;

        await grievance.save();

        res.status(200).json(grievance);
        console.log("Private Grievance status updated successfully");

    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message: "Server Error"});
    }
}