// dependencies - express (api server), dotenv(sensitive data encryption), cors(to resolve cors errors)
// db - from the utils folder
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import db from "./utils/db.js";

// mandatory function call to use dotenv file
dotenv.config();

// express is initialised
const app = express();

// setting up express to work with cors, json and ASCII values
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
        method: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

app.use(express.json());

app.use(express.urlencoded({ extented: true }));

// getting the port from the dotenv file; if that fails, set it to 4000
const port = process.env.PORT || 4000;

// declaring a server route to '/' which returns 'Cohort!' to caller
app.get('/', (req, res) => {
    res.send('Cohort!');
})

// declaring a server route to '/mishal' which returns 'Mishal!' to caller
app.get('/mishal', (req, res) => {
    res.send('Mishal!')
})

// connecting to the db
db();

// server runs and is open to connections at the given port
app.listen(port, () => {
    console.log(`Application running at port ${port}`);
});
