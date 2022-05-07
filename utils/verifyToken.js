const User = require("../model/userModel");
const sendEmail = require("./mail");
const generateVerifyToken = async (user, res, req, info) => {
  const VerifyToken = await user.getVerifyToken();
  await user.save({ validateBeforeSave: false });
  // now we need to cretae a link
  const verifyUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/verify/email/${VerifyToken}`;

  const message = `Thaks for Connecting with us click here:- \n\n ${verifyUrl}`;

  // now we need to send the mail by the help of nodemailer
  try {
    await sendEmail({
      message,
      email: user.email,
      subject: "Verify Your Account",
    });

    res.status(200).json({
      success: true,
      message: info,
    });
  } catch (error) {
    (user.isVerifyToken = undefined),
      (user.isVerifyExpire = undefined),
      await user.save({ validateBeforeSave: false });
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

module.exports = generateVerifyToken;
