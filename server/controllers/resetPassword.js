const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
require("dotenv").config();

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      })
    }
    const token = crypto.randomBytes(20).toString("hex")

    await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600*1000,
      }
    )
    // console.log("DETAILS", updatedDetails)

    const url = `${process.env.FRONTEND_URL}/update-password/${token}`

    await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    )

    res.json({
      success: true,
      message: "Email Sent Successfully, Please Check Your Email to Continue Further",
    })
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    })
  }
}


exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;// get request from front-end

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d~`!@#$%^&*()-_=+{};:"'.,<>|]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long and include one number, one lowercase letter, one uppercase letter, and one special character."
      });
    }
    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      })
    }
    const userDetails = await User.findOne({ token: token })
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is not Valid",
      })
    }
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      })
    }
    
    const encryptedPassword = await bcrypt.hash(password, 10)
    if(encryptedPassword === userDetails.password){
      return res.status(403).json({
        success: false,
        message: "Password cannot be same as previous Password",
      })
    }
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    )
    return res.status(200).json({
      success: true,
      message: `Password Reset Successful`,
    })
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    })
  }
}
