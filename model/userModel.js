const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide name"],
    },
    email:{
        type:String,
        required:[true,"Please provide email"],
        unique:true
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordExpire:{
        type:String,
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:[4,"Length of pasword must be greter than 4"],
    },
    isVerifyToken:{
        type:String,
    },
    isVerifyExpire:{
        type:String,
    },
    role:{
        type:String,
        default:"user"
    }
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.getVerifyToken = async function(next){
    //generate token
    const verifyToken = crypto.randomBytes(20).toString("hex");

    this.isVerifyToken = crypto.createHash("sha256").update(verifyToken).digest("hex");

    this.isVerifyExpire = Date.now() + (15*60*1000);

  //  console.log(this.isVerifyExpire,this.isVerifyToken,verifyToken);

    return verifyToken;

}

userSchema.methods.getjwtToken = async function(next){
    const token = jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
    return token;
    
}

userSchema.methods.comparePassword = async function(userEnteredPassword){
    return await bcrypt.compare(userEnteredPassword,this.password)
}

userSchema.methods.getResetToken = async function(next){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + (15*60*1000);

    return resetToken;

}

module.exports = mongoose.model("User",userSchema);
