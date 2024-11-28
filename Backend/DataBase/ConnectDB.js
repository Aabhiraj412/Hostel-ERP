import mongoose from "mongoose";

const ConnectDB = async () => {

    // Connect to MongoDB
    try {
        const conn = await mongoose.connect(process.env.MongoDB_URI);
        console.log(`MongoDB Connected`);
    } 
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default ConnectDB;