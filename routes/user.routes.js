import express from 'express';
import { loginUser, registerUser, verifyUser } from '../controller/user.controller.js';

// declaring the router
const userRouters = express.Router();

// routing requests to controller
userRouters.post("/register", registerUser);
userRouters.get("/verify/:token", verifyUser);
userRouters.post("/login", loginUser);

export default userRouters;