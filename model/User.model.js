import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

// adding a pre-hook to the save function such that whenever the password field is updated, it is stored in encrypted format
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next()
})

// tell mongodb that for requests to 'users' collection use 'userSchema' to validate the structure
const User = mongoose.model('User', userSchema);

export default User;