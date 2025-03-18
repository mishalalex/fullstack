import User from '../model/User.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const registerUser = async (req, res) => {

    // get the required data from user from the request 
    const { name, email, password } = req.body;
    // verify whether the mandatory data is send by the user
    if (!name || !email || !password) {
        res.status(400).json({
            message: "All fields are required."
        })
    }

    try {
        // validate whether such a user exist in our database
        const existingUser = await User.findOne({ email });
        // return the error message to user if the user already exists
        if (existingUser) {
            res.status(400).json({
                message: "User already exists. Please login."
            })
        }
        // once verified, create a new user in db
        const newUser = await User.create({
            name,
            email,
            password
        });

        // if something goes wrong, return an error to the user
        if (!newUser) {
            res.status(500).json({
                message: `User is not registered. Please contact admin.`
            });
        }

        // generate a token which can be given to the user to verify the user's email
        const token = crypto.randomBytes(32).toString("hex");
        // save this token in the database
        newUser.verificationToken = token;

        // update the database with all the above mentioned changes
        await newUser.save();

        // create the pre-requisites for sending email using nodemailer (will beautify this code later)
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

        // send the email to the user with the verification code
        await transporter.sendMail(mailOptions);

        // once done, we can return the response to client stating the user is successfully registered
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

    // get the verification token from the api request parameter
    const { token } = req.params;
    // verify whether a token is sent by the user
    if (!token) {
        res.status(400).json({
            message: "Token is missing."
        })
    }

    try {
        // check whether the token sent by the user exists in our database
        const verifyThisUser = await User.findOne({
            verificationToken: token
        })

        // return an error response to the user if the token sent by the user doesn't exist in our database
        if (!verifyThisUser) {
            res.status(400).json({
                message: "Invalid token"
            })
        }

        // set the user as verified and delete the verification token from the user's data
        verifyThisUser.isVerified = true;
        verifyThisUser.verificationToken = null;

        // save the above changes to the user
        await verifyThisUser.save();

        console.log(verifyThisUser)

        // once done, we can successfully tell the client that the user is verified
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