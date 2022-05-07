const User = require("../model/userModel");

const generateVerifyToken = require("../utils/verifyToken");

const setToken = require("../utils/jwtTokens");

const crypto = require("crypto");
const sendEmail = require("../utils/mail");

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Please provide name email password",
      });
    }

    const user = await User.create(req.body);

    // now generate a token to verify this email
    generateVerifyToken(
      user,
      res,
      req,
      `Email sent to ${user.email} successfully`
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ mesaage: error.mesaage });
  }
};

const verifyEmail = async (req, res, next) => {
  const isVerifyToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(req.params.token);
  console.log(isVerifyToken);
  // now find the user having this verifyEmailToken
  const user = await User.findOne({
    isVerifyToken,
    isVerifyExpire: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) {
    return res.status(400).json({
      mesaage: "verify Token is invalid or may be expired",
    });
  }
  user.isVerified = true;
  user.isVerifyExpire = undefined;
  user.isVerifyToken = undefined;

  await user.save();

  setToken(user, res, 201);
};

const login = async (req, res, next) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return res.status(400).json({
      message: "Please enter email and Password",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Invalid Email or Password",
    });
  }
  //   console.log(user.isVerified)
  if (!user.isVerified) {
    return generateVerifyToken(
      user,
      res,
      req,
      `Please verify your email, Email sent to ${user.email} successfully`
    );
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Invalid Email or Password",
    });
  }

  setToken(user, res, 201);
};

const logout = async(req,res,next)=>{
  try {
    res.cookie('token',null,{
      expires: new Date(Date.now()),
      httpOnly:true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged out SuccessFully",
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message:error.mesaage
    })
  }
}

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: `No user exist with this ${email} email` });
    }
    const resetToken = await user.getResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetToken}`;

    const message = `Click here to reset your Password \n\n ${resetUrl} \n\n If it's not you than ignore it`;
    try {
      await sendEmail({
        email,
        message,
        subject: "Reset you Password",
      });
      res.status(200).json({
        success: true,
        message: "Reset Link sent to your email",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({
        message: error.mesaage,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.mesaage,
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt : Date.now()}
    })

    if(!user){
      return res.status(401).json({
        message:'Reset Password token is invalid or expired'
      })
    }

    const{newPassword,confirmPassword} = req.body;

    if(newPassword!==confirmPassword){
      return res.status(401).json({
        message:'Password and resetPassword are not same'
      })
    }
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.password = newPassword
    await user.save();

    setToken(user,res,201);

  } catch (error) {
    console.log(error)
    res.status(400).json({
      message:error.message
    })
  }
};

module.exports = { register, verifyEmail, login, forgetPassword, resetPassword, logout};
