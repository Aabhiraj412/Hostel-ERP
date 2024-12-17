import jwt from 'jsonwebtoken';

export const generateWardenToken = (user,res)=>{
    const token = jwt.sign({user}, process.env.JWT_Warden, { 
        expiresIn: '15d' 
    });
    res.cookie('jwt', token,{
        maxAge:15*24*60*60*1000,  //15days
        httpOnly: true,
        // sameSite: 'strict',  //for https only
        sameSite: 'lax',
        // secure: process.env.NODE_ENV !== 'development'
        secure : true,
    });
}
export const generateHostlerToken = (user,res)=>{
    const token = jwt.sign({user}, process.env.JWT_Hostler, { 
        expiresIn: '15d' 
    });
    res.cookie('jwt', token,{
        maxAge:15*24*60*60*1000,  //15days
        httpOnly: true,
        // sameSite: 'strict',  //for https only
        // sameSite: 'lax',
        sameSite: 'none',
        // secure: process.env.NODE_ENV !== 'development'
        secure : true,
    });
}
