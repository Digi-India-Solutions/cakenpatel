const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/SignupModel');
const transporter = require("../Utils/Mailsender");


const generateReferralCode = (name) => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return name.slice(0, 4).toUpperCase() + random;
};


const createRecord = async (req, res) => {
    try {
        let { name, email, password, role, referralCodeUsed } = req.body;

        // ✅ basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        email = email.toLowerCase().trim();

        // ✅ check existing email first
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered.",
            });
        }

        // ✅ validate referral code (if provided)
        let referrerUser = null;

        if (referralCodeUsed) {
            referrerUser = await User.findOne({ referralCode: referralCodeUsed });
            if (!referrerUser) { return res.status(400).json({ success: false, message: "Invalid referral code.", }); }

            if (referrerUser) {
                referrerUser.isReferralRewardGiven = true;
                referrerUser.walletBalance = referrerUser?.walletBalance + 100
                await referrerUser.save();
            }
        }

        // ✅ generate UNIQUE referral code
        let newReferralCode;
        let isUnique = false;

        while (!isUnique) {
            newReferralCode = generateReferralCode(name);
            const exists = await User.findOne({
                referralCode: newReferralCode,
            });
            if (!exists) isUnique = true;
        }

        // ✅ hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // ✅ create user
        const newUser = await User.create({
            name,
            email,
            role: role || "User",
            password: hashedPassword,
            referralCode: newReferralCode,
            referredBy: referralCodeUsed || null,
            // walletBalance: referrerUser ? 100 : 0,
        });

        // ✅ send email (non-blocking but safe)
        try {
            const mailOptions = {
                from: process.env.MAIL_SENDER,
                to: newUser.email,
                subject: "Welcome to CAKE NPETALS - Your Account Has Been Created!",
                html: `
                <html>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                        <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                            <div style="text-align: center; background-color: #ff5733; color: #ffffff; padding: 20px;">
                                <h1 style="margin: 0;">Welcome to CAKE NPETALS!</h1>
                            </div>
                            <div style="margin-top: 20px; padding: 20px; text-align: center;">
                                <p style="font-size: 16px; line-height: 1.6;">Hello ${newUser.name},</p>
                                <p style="font-size: 16px; line-height: 1.6;">We're excited to let you know that your account has been successfully created with CAKE NPETALS!</p>
                                <p style="font-size: 16px; line-height: 1.6;">You can now explore a wide range of delicious cakes and treats available for you. Enjoy our amazing deals!</p>
                                <a href="https://ssdipl.com/" style="display: inline-block; padding: 12px 30px; background-color: #ff5733; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">Shop Now</a>
                            </div>
                            <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #777777;">
                                <p style="margin: 0;">Thank you for choosing CAKE NPETALS. We are excited to serve you the best cakes in town!</p>
                                <p style="margin: 0;">Team CAKE NPETALS</p>
                                <p style="margin: 0;">If you have any questions, feel free to contact us at <a href="mailto:support@cakenpetals.com" style="color: #ff5733;">support@cakenpetals.com</a></p>
                            </div>
                        </div>
                    </body>
                </html>
            `,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.error(error);
                    return res.status(401).json({ success: false, message: "Failed to send email." });
                }
            });

        } catch (mailError) {
            console.error("Mail error:", mailError);
            // ❗ do NOT fail signup if mail fails
        }

        return res.status(201).json({ success: true, message: "New user account created successfully.", data: newUser, });

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Email already registered.", });
        }

        return res.status(500).json({ success: false, message: "Internal Server Error.", });
    }
};


// Get all user records
const getRecord = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: "User records found.",
            data: users.reverse()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

const getAdminUser = async (req, res) => {
    try {
        const users = await User.find({ role: { $nin: ["Admin", "User"] } });
        res.status(200).json({ success: true, message: "User records found.", data: users.reverse() });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
}
// Get a single user record by ID
const getSingleRecord = async (req, res) => {
    try {
        const user = await User.findById(req.params._id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User record not found." });
        }
        res.status(200).json({
            success: true,
            message: "User record found.",
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const DeleteRecord = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User record not found." });
        }
        await user.deleteOne()
        res.status(200).json({
            success: true,
            message: "User delete successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }
        const key = user.role === "Admin" ? process.env.JWT_SALT_KEY_ADMIN : process.env.JWT_SALT_KEY_BUYER;

        const token = jwt.sign({
            userId: user._id, role: user.role, referralCode: user?.referralCode, referredBy: user?.referredBy,
            walletBalance: user?.walletBalance, isReferralRewardGiven: user?.isReferralRewardGiven,
            name: user.name, email: user?.email, phone: user?.phone, address: user?.address,
            profilePic: user?.profilePic, cart: user?.cart,
        }, key, { expiresIn: '15d' });

        res.status(200).json({
            success: true,
            data: user,
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const updateRolesByAdmin = async (req, res) => {
    try {
        const { permissions } = req.body;
        const userId = req.params.id;

        if (!permissions) {
            return res.status(400).json({ success: false, message: "Permissions are required.", });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { permissions }, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found.", });
        }

        return res.status(200).json({ success: true, message: "User permissions updated successfully.", data: updatedUser, });
    } catch (error) {
        console.error("Update role error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error.", });
    }
};

// Forgot password: Step 1 (Send OTP)
const forgetPassword1 = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        const otp = Math.floor(Math.random() * 1000000);
        user.otp = otp;
        await user.save();

        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: user.email,
            subject: "OTP for Password Reset",
            text: `Hello ${user.name},\n\nYour OTP for password reset is ${otp}. Please do not share this OTP with anyone.\n\nTeam Ricco`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(400).json({ success: false, message: "Failed to send OTP." });
            }
        });

        res.status(200).json({ success: true, message: "OTP sent to your registered email address." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// Forgot password: Step 2 (Validate OTP)
const forgetPassword2 = async (req, res) => {
    try {
        const { username, email, otp } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized activity." });
        }

        if (user.otp !== parseInt(otp)) {
            return res.status(401).json({ success: false, message: "Invalid OTP." });
        }

        res.status(200).json({ success: true, message: "OTP validated." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// Forgot password: Step 3 (Reset password)
const forgetPassword3 = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized activity." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password has been reset." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

module.exports = {
    createRecord,
    getSingleRecord,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3,
    getRecord,
    getAdminUser,
    DeleteRecord,
    updateRolesByAdmin
};
