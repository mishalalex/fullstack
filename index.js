import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import db from "./utils/db.js";

dotenv.config();

const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
        method: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
app.use(express.json());
app.use(express.urlencoded({ extented: true }));

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Cohort!');
})

app.get('/mishal', (req, res) => {
    res.send('Mishal!')
})

db();

app.listen(port, () => {
    console.log(`Application running at port ${port}`);
});
