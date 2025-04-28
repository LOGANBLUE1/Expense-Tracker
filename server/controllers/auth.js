const bcrypt = require("bcrypt")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const Profile = require("../models/Profile")
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const fetch = require("node-fetch");

require("dotenv").config()

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email,
      password, confirmPassword, otp } = req.body;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required"
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,16}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d~`!@#$%^&*()-_=+{};:"'.,<>|]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long and include one number, one lowercase letter, one uppercase letter, and one special character."
      });
    }

    
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match. Please try again."
      });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login to continue."
      });
    }

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "The OTP did not found"
      });
    } 
    else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid"
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null
    })

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user
    });
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again."
    });
  }
}



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`
      });
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`
      })
    }
    else if(user.loginType !== "Direct"){
      return res.status(403).json({
        success: false,
        message: `User is registered via Google auth`
      })
    }

    if (await bcrypt.compare(password, user.password)) {

      const payload = { email: user.email, id: user._id};
      const token = jwt.sign( payload,
          process.env.JWT_SECRET,
          {expiresIn: "24h"}
      );
    
      //creating cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),// 3 days
        httpOnly: true
        // sameSite: 'Strict'
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`
      });

    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`
      });
    }
  } catch (error) {
    console.error('Failed to login ', error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`
    });
  }
}

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic email validation (optional)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,16}$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    const checkUserPresent = await User.findOne({ email })
    
    if (checkUserPresent) {
      return res.status(409).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    let otp;
    let result;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    } while (result);

    //for storing in db
    await OTP.create({ email, otp });

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
    });
  } catch (error) {
    console.log("Problem with otp sending", error.message)
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}


exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id)
    if(userDetails.loginType !== "Direct"){
      return res.status(403).json({
        success: false,
        message: "User is registered via Google auth"
      })
    }
    
    const { oldPassword, newPassword } = req.body
    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )

    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "The password is incorrect" 
      })
    }

    if(oldPassword === newPassword){
      return res.status(401).json({ 
        success: false, 
        message: "The password is same as old password" 
      })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d~`!@#$%^&*()-_=+{};:"'.,<>|]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long and include one number, one lowercase letter, one uppercase letter, and one special character."
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
        const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      // console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    return res.status(200).json({ 
      success: true, 
      message: "Password updated successfully" 
    })
  } catch (error) {
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}

exports.googleLogin = async (req, res) => {
  const { googleToken } = req.body;

  try {
    if (!googleToken) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${googleToken}`, // Use the access_token here
      },
    });

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const data = await response.json();

    const { given_name, family_name, email, picture } = data;

    // Check if the user already exists
    let user = await User.findOne({ email: email });

    // If user doesn't exist, create a new user
    if (!user) {
      const profile = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
      });

      user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email: email,
        googleId: data.sub, // Use the Google user ID
        loginType: "Google",
        additionalDetails: profile._id,
        image: picture,
      });
    } else if(user.loginType !== "Google"){
      return res.status(400).json({
        success: false,
        message: "User(Direct) already exists with this email id. Please login using email and password",
      });
    }


    // Generate a JWT token for the user
    const payload = { email: user.email, id: user._id};
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    // Send the response
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: `Google Login Success`,
    });
  } catch (err) {
    console.error("Error during Google login:", err);
    res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};