import User from '../model/User.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const registerUser = async (req, res) => {

    // create a token
    // save token in db
    // send token to user via email
    // return success message to user


    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({
            message: "All fields are required."
        })
    }

    console.log(email);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                message: "User already exists. Please login."
            })
        }
        const newUser = await User.create({
            name,
            email,
            password
        });

        if (!newUser) {
            res.status(500).json({
                message: `User is not registered. Please contact admin.`
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        newUser.verificationToken = token;

        await newUser.save();

        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAILTRAP_EMAIL, // sender address
            to: newUser.email, // list of receivers
            subject: "Verify your email", // Subject line
            text: `Please click on this link: ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // plain text body
        }

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "User is successfully registered.",
            success: true
        })

    } catch (error) {
        res.status(400).json({
            message: `Error occured while registering the user. Error: ${error}`
        });
    }

}

const verifyUser = async (req, res) => {

    const { token } = req.params;
    if (!token) {
        res.status(400).json({
            message: "Token is missing."
        })
    }

    console.log(token);

    try {
        const verifyThisUser = await User.findOne({
            verificationToken: token
        })

        if (!verifyThisUser) {
            res.status(400).json({
                message: "Invalid token"
            })
        }

        verifyThisUser.isVerified = true;
        verifyThisUser.verificationToken = null;

        await verifyThisUser.save();

        console.log(verifyThisUser)

        res.status(200).json({
            message: "User has been successfully verified. Please login to continue"
        })


    } catch (error) {
        res.status(400).json({
            message: `Error occured while verifying the user. Error: ${error}`
        });
    }

}

export { registerUser, verifyUser };