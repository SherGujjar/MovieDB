const jwt = require("jsonwebtoken");
const User = require('../model/userModel');

const isAuthenticate = async(req,res,next)=>{
    try {
        const {token} = req.cookies;
        
        if(!token){
            return res.status(400).json({
                message:"Please Login to access this route"
            })
        }
        
        const decode = jwt.verify(token,process.env.JWT_SECRET);

        req.user = await User.findById(decode.id);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message:error.message
        })
    }
}

const authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:`Role: ${req.user.role} is not allowed to access this resource`
            })
        }
        next();
    }
}

module.exports = {isAuthenticate,authorizeRoles};