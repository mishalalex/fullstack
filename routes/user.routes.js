import express from 'express';
import { loginUser, registerUser, verifyUser, getUserProfile, logoutUser, forgotPassword, resetPassword } from '../controller/user.controller.js';
import { isLoggedIn } from '../middleware/isLoggedIn.middleware.js';

// declaring the router
const userRouters = express.Router();

// routing requests to controller
userRouters.post("/register", registerUser);
userRouters.get("/verify/:token", verifyUser);
userRouters.post("/login", loginUser);
userRouters.get("/profile", isLoggedIn, getUserProfile);
userRouters.get("/logout", isLoggedIn, logoutUser);
userRouters.post("/forgot_password", forgotPassword);
userRouters.post("/reset_password/:token", resetPassword);

export default userRouters;