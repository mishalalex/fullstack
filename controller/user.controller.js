import User from '../model/User.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const registerUser = async (req, res) => {

    // get the required data from user from the request 
    const { name, email, password } = req.body;
    // verify whether the mandatory data is send by the user
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required."
        })
    }

    try {
        // validate whether such a user exist in our database
        const existingUser = await User.findOne({ email });
        // return the error message to user if the user already exists
        if (existingUser) {
            return res.status(400).json({
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
            return res.status(500).json({
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
        return res.status(201).json({
            message: "User is successfully registered.",
            success: true
        })

    } catch (error) {
        return res.status(400).json({
            message: `Error occured while registering the user. Error: ${error}`
        });
    }

}

const verifyUser = async (req, res) => {

    // get the verification token from the api request parameter
    const { token } = req.params;
    // verify whether a token is sent by the user
    if (!token) {
        return res.status(400).json({
            message: "Token is missing."
        })
    }

    try {
        // check whether the token sent by the user exists in our database
        const unverifiedUser = await User.findOne({
            verificationToken: token
        })

        // return an error response to the user if the token sent by the user doesn't exist in our database
        if (!unverifiedUser) {
            return res.status(400).json({
                message: "Invalid token"
            })
        }

        // set the user as verified and delete the verification token from the user's data
        unverifiedUser.isVerified = true;
        unverifiedUser.verificationToken = null;

        // save the above changes to the user
        await unverifiedUser.save();

        console.log(`Unverified user - ${unverifiedUser.name} is verified now`);

        // once done, we can successfully tell the client that the user is verified
        return res.status(200).json({
            message: "User has been successfully verified. Please login to continue"
        })


    } catch (error) {
        return res.status(400).json({
            message: `Error occured while verifying the user. Error: ${error}`
        });
    }

}

const loginUser = async (req, res) => {
    // get the data from user
    const { email, password } = req.body;

    // validate whether the required data is in the request
    if (!email || !password) {
        return res.status(400).json({
            message: "All the fields are required"
        });
    }

    try {
        // check whether a user exists with the given email id
        const existingUser = await User.findOne({
            email: email
        })

        // if user is not found then return error message to user
        if (!existingUser) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        };

        // using bcrypt.compare function, compare the password sent by the user and the one stored in database
        const doesPasswordsMatch = await bcrypt.compare(password, existingUser.password);
        console.log(password);
        console.log(existingUser.password)
        // if the hash doesn't match then return an error to the user (let's return invalid password for now)
        if (!doesPasswordsMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        // if the password is validated then create a JWT token ...
        const jwt_token = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.JWT_SECRETKEY, {
            expiresIn: process.env.JWT_EXPIRESIN
        })

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        }

        // ... and store it in user's cookies
        res.cookie("token", jwt_token, cookieOptions);

        // once everything is set, then return a success message to the user
        return res.status(200).json({
            message: "User is successfully logged in",
            success: true,
            jwt_token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                role: existingUser.role
            }

        })

    } catch (error) {
        // if any error is encountered while logging the user in, return appropriate error
        return res.status(400).json({
            message: `Error occured while logging the user in. Error: ${error}`
        });
    }
}

const getUserProfile = async (req, res) => {
    const { id } = req.user;
    try {
        const existingUser = await User.findById(id).select('-password')
        if (!existingUser) {
            return res.status(400).json({
                message: "user not found. you might want to login again"
            })
        }
        return res.status(200).json({
            success: true,
            existingUser
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Unable to get user's profile. Error: ${err}`
        })

    }

}

const logoutUser = async (req, res) => {
    console.log("Reached controller")
    try {
        res.cookie('token', '', {})
        return res.status(200).json({
            message: "user logged out successfully"
        })
    } catch (error) {

    }
}

const forgotPassword = async (req, res) => {
    console.log("reached forgot password")
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            message: "You'll need to send your registered email to reset your password."
        })
    }
    console.log("email: ", email)
    try {
        const existingUser = await User.findOne({
            email: email
        })

        if (!existingUser) {
            return res.status(400).json({
                message: "User with this email is not found. Please register or provide a registered email id to continue"
            })
        }

        console.log("existing user found to reset password")
        const resetToken = await crypto.randomBytes(32).toString("hex");
        existingUser.resetPasswordToken = resetToken;
        await existingUser.save();

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
            to: existingUser.email, // list of receivers
            subject: "Did you request for a password reset?", // Subject line
            text: `Please click on this link: ${process.env.BASE_URL}/api/v1/users/reset_password/${resetToken}`, // plain text body
        }

        // send the email to the user with the verification code
        await transporter.sendMail(mailOptions);

        // once done, we can return the response to client stating the user is successfully registered
        return res.status(200).json({
            message: "Process to reset your password has been initiated. Please check your email for further instructions.",
            success: true
        })
    } catch (error) {
        // once done, we can return the response to client stating the user is successfully registered
        return res.status(400).json({
            message: "Error while resetting your password. Contact administrator",
            success: true
        })
    }
}

const resetPassword = async (req, res) => {
    console.log("reached reset password")
    const { token } = req.params;
    const { new_password, confirm_new_password } = req.body
    console.log(token)
    if (!token || !new_password || !confirm_new_password) {
        return res.status(400).json({
            message: "All details are required"
        })
    }
    if (new_password !== confirm_new_password) {
        return res.status(400).json({
            message: "Both the passwords must be the same. Try again"
        })
    }

    try {
        const existingUser = await User.findOne({
            resetPasswordToken: token
        })

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        existingUser.resetPasswordToken = undefined;
        existingUser.password = confirm_new_password;
        await existingUser.save()

        return res.status(200).json({
            message: "Your password has been reset. Please login to continue",
            success: true
        })


    } catch (error) {
        // once done, we can return the response to client stating the user is successfully registered
        return res.status(400).json({
            message: "Error while resetting your password. Contact administrator",
            success: false
        })
    }
}

export { registerUser, verifyUser, loginUser, getUserProfile, logoutUser, forgotPassword, resetPassword };