import mongoose from "mongoose";

// declare the user schema for user
const userSchema = new mongoose.Schema({
    "name": String,
    "email": String,
    "password": String,
    "role": {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    "isVerified": {
        type: String,
        default: false,
    },
    "verificationToken": {
        type: String
    },
    "resetPasswordToken": {
        type: String
    },
}, {
    timestamps: true
});

// tell mongodb that for requests to 'users' collection use 'userSchema' to validate the structure
const User = mongoose.model('User', userSchema);

export default User;