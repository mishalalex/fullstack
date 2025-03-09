import mongoose from "mongoose";
import dotenv from 'dotenv';

// re-importing dotenv package just in case
dotenv.config();

// using the monegoose.connect command, we are trying to connect to db by fetching the connection url from dotenv file
const db = () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("Connected to mongodb successfully!")
        })
        .catch((err) => {
            console.log(`Error connecting to mongodb: ${err}`)
        });
}

// exporting this db function to be imported into other files
export default db;