import jwt from 'jsonwebtoken';
import Warden from '../Schemas/Warden.model.js';

const wardenProtectRoute = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unauthorised-no Token Provided"});
        }
        
        const decode = jwt.verify(token,process.env.JWT_Warden);
        
        if(!decode){
            return res.status(401).json({message:"Invalid Token"});
        }
        const warden = await Warden.findById(decode.user);

        if(!warden){
            return res.status(401).json({message:"No Warden Found"});
        }
        
        req.warden = warden;

        next();
    }
    catch(e){
        res.status(500).json({message: "Some error Occur in Warder Protect Route"});
        console.log("Some erroe Occur in Protect Route", e.message);
    }

};

export default wardenProtectRoute;