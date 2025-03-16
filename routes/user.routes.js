import express from 'express';
import { registerUser } from '../controller/user.controller.js';

const userRouters = express.Router();
userRouters.get("/register", registerUser);

export default userRouters;