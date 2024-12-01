import Warden from "../Schemas/Warden.model.js";
import bcrypt from 'bcryptjs';
import { generateWardenToken } from "../Utils/GenerateToken.utils.js";

export const wardenRegisteration = async (req, res) => {
    try{
        const {
            name,
            phone,
            email,
            aadhar,
            gender,
            hostel,
            post,
            address,
            password,
            confirm_password
        } = req.body;
        
        if(!name || !phone || !email || !aadhar || !gender || !hostel || !post || !address || !password || !confirm_password){
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password should be at least 6 characters long"});
        }

        if(password !== confirm_password){
            return res.status(400).json({message: "Password do not match"});
        }

        const newphone = await Warden.findOne({phone});
        const newemail = await Warden.findOne({email});
        const newaadhar = await Warden.findOne({aadhar});

        if(newphone) 
            return res.status(400).json({message: "Phone number already exists"});
        
        if(newemail)
            return res.status(400).json({message: "Email already exists"});

        if(newaadhar)
            return res.status(400).json({message: "Aadhar number already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newwarden = new Warden({
            name,
            phone,
            email,
            aadhar,
            gender,
            hostel,
            post,
            address,
            password: hashedPassword
        });

        if(newwarden){
            generateWardenToken(newwarden._id, res);

            await newwarden.save();

            res.status(201).json(newwarden);

            console.log("Warden registered successfully");
        }

    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message: "Server Error"});
    }
}

export const wardenLogin = async(req, res) => {
    
    try{

        const {
            user,
            password
        } = req.body;
    
        if(!user || !password){
            return res.status(400).json({message: "All fields are required"});
        }
    
        const newuser = await Warden.findOne({$or: [{phone: user}, {email: user}, {aadhar: user}]})
    
        if(!newuser){
            return res.status(400).json({message: "Invalid Credentials"});
        }
    
        const isMatch = await bcrypt.compare(password, newuser.password);
    
        if(!isMatch){
            return res.status(400).json({message: "Invalid Credentials"});
        }
    
        generateWardenToken(newuser._id, res);
    
        res.status(200).json(newuser);
        console.log("Warden logged in successfully");
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message: "Server Error"});
    }
}

export const wardenLogout = async(req, res) => {
    
    try{
        res.clearCookie('jwt');
        res.status(200).json({message: "Warden Logged Out"});
        console.log("Warden logged out successfully");
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message: "Server Error"});
    }
}

export const getWarden = async(req, res) => {
    
    try{

        const warden = req.warden;

        if(!warden){
            return res.status(401).json({message: "Unauthorised-no Warden Provided"});
        }

        res.status(200).json(warden);
        console.log("Warden details fetched successfully");
        
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        res.status(500).json({message: "Server Error"});
    }

};