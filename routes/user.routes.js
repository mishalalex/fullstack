import express from 'express';
import { registerUser } from '../controller/user.controller.js';

// declaring the router
const userRouters = express.Router();

// routing requests to controller
userRouters.get("/register", registerUser);

export default userRouters;