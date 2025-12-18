import jwt from 'jsonwebtoken';
import Hostler from '../Schemas/Hostlers.model.js';

const hostlerProtectRoute = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unauthorised-no Token Provided"});
        }
        
        const decode = jwt.verify(token,process.env.JWT_Hostler);
        
        if(!decode){
            return res.status(401).json({message:"Invalid Token"});
        }
        const hostler = await Hostler.findById(decode.user);

        if(!hostler){
            return res.status(401).json({message:"No hostler Found"});
        }
        
        req.hostler = hostler;

        next();
    }
    catch(e){
        res.status(500).json({message: "Some error Occur in Hostler Protect Route"});
        console.log("Some erroe Occur in Protect Route", e.message);
    }

};

export default hostlerProtectRoute;