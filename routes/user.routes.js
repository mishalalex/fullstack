import express from 'express';
import { registerUser, verifyUser } from '../controller/user.controller.js';

// declaring the router
const userRouters = express.Router();

// routing requests to controller
userRouters.post("/register", registerUser);
userRouters.get("/verify/:token", verifyUser);

export default userRouters;