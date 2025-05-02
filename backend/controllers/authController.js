const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const dotenv=require("dotenv");
const getGeoLocation = require("../utils/getLoc");
const { validationResult } = require('express-validator'); //for validating requests
dotenv.config();

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(8).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "contact.skillswap@gmail.com",
        pass: "mtmstfcenrryopyi",
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: "contact.skillswap@gmail.com",
      to: email,
      subject: 'Password Reset Request',
      html: `
          <html>
            <body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #e9eff1;">
              <div style="max-width: 650px; margin: 50px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);">
                <header style="text-align: center; margin-bottom: 20px;">
                  <h1 style="font-size: 32px; color: #333; margin: 0;">NewsDroid</h1>
                  <p style="font-size: 18px; color: #888; margin: 5px 0 0;">Password Reset Request</p>
                </header>
                <section style="padding: 20px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 30px;">
                  <p style="color: #333; font-size: 16px; line-height: 1.5;">Hello,</p>
                  <p style="color: #555; font-size: 16px; line-height: 1.5;">We received a request to reset your password. If you made this request, click the button below to reset your password.</p>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color:rgb(84, 175, 76); color: #ffffff; padding: 16px 30px; font-size: 18px; text-decoration: none; border-radius: 5px; display: inline-block; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">Reset Password</a>
                  </p>
                  <p style="color: #888; font-size: 14px; text-align: center;">This link will expire in 1 hour for security purposes.</p>
                </section>
                <footer style="text-align: center; font-size: 14px; color: #777;">
                  <p>If you did not request a password reset, please ignore this email or <a href="#" style="color: #4CAF50; text-decoration: none;">contact support</a>.</p>
                  <p style="margin-top: 20px;">&copy; 2024 NewsDroid. All rights reserved.</p>
                </footer>
              </div>
            </body>
          </html>
        `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      return res.status(200).json({ message: 'Password reset email sent successfully',succes:true });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save(); 

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const register = async (req, res) => {
  try {
      const { username, email, password,preferences,} = req.body;
      const location = await getGeoLocation();
      const existingUser = await User.findOne({ 
        $or: [
          { email: email },
          { username: username }
        ] 
      });
      
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({ message: 'Email already exists' });
        } else if (existingUser.username === username) {
          return res.status(400).json({ message: 'Username already exists' });
        }
      }
      function getRegionCode(lat, lon) {
        const RADIUS_KM = 5;
        const latStep = RADIUS_KM / 111; // ≈ 0.09 degrees
        const lonStep = RADIUS_KM / (111 * Math.cos(lat * Math.PI / 180)); // Adjust for curvature
        const latRegion = Math.floor(lat / latStep);
        const lonRegion = Math.floor(lon / lonStep);
        return latRegion * 100000 + lonRegion;
      }
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);

      const latitude = parseFloat(location.latitude || "0");
      const longitude = parseFloat(location.longitude || "0");
      const regionCode = getRegionCode(latitude, longitude);

      const newUser = new User({
          username,
          email,
          password: hashpassword,
          location: {
            lat: location.latitude,
            lon: location.longitude,
          },
          code: regionCode,
          preferences: {
            categories: preferences?.categories || [],
            language: preferences?.language || 'en',
          },
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully', 
        userId: newUser._id 
       });

  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
  }
};


const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User email does not exist." })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({
      id: user._id,
      role: user.role,
    },
      process.env.JWT_SECRET,
      { expiresIn: '24h', }
    )

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  }
  catch(error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const updateUserFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body;

  try {
      await User.findByIdAndUpdate(userId, { fcmToken });
      res.status(200).json({ message: "FCM Token Updated" });
  } catch (error) {
      res.status(500).json({ error: "Failed to update token" });
  }
};

const userData = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId); 
    if (user) {
      res.json({ email: user.email,
            mobile: user.mobile,
            firstName: user.firstName,
            lastName: user.lastName,
            dob: user.dob || { day: '', month: '', year: '' },
            gender: user.gender,
            city: user.city });
    } else {
      console.log("No user found");
      res.status(404).json({ error: "No user found" }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId, mobile, firstName, lastName, dob, gender, city } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        mobile,
        firstName,
        lastName,
        dob,
        gender,
        city
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  sendPasswordResetEmail,
  resetPassword,
  register,
  login,
  updateUserFcmToken,
  userData,
  updateUserProfile
};
