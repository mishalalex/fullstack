// getting-started.js
import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import db from './utils/db.js';

// import all user routes
import userRoutes from './routes/user.routes.js';

// to use .env file
dotenv.config();

// initializing express js and retrieving PORT variable from .env file
const app = express();
const port = process.env.PORT || 4000;

// express boiler plate code
app.use(
    cors({
        origin: 'http://127.0.0.1:3000',
        credentials: true,
        method: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db initialised
db();

// telling express to route requests to these links to these routers
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
    console.log("Application is initialized")
})