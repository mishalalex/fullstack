// we need to use mongoose ODM and dotenv
import mongoose from "mongoose";
import dotenv from "dotenv";

// initializing dotenv package
dotenv.config();

// mongodb atlas connection call
const db = () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log("MongoDB Atlas connection successful"))
        .catch((err) => console.log(`Error conncting to db: ${err}`))
}

// exporting this db function to be imported into other files
export default db;