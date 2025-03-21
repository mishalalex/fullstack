import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isLoggedIn = async (req, res, next) => {
    try {
        console.log("Reached middleware")
        console.log(req.cookies)

        console.log(req.cookies);
        let token = req.cookies?.token;
        console.log(`Token found: `, token ? "Yes" : "No");
        if (!token) {
            console.log("No Token");
            return res.status(400).json({
                success: false,
                message: "Authentication failed"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        console.log("Decoded data: ", decoded)
        req.user = decoded
        next()
    } catch (err) {
        console.log(`Error authentication the user: ${err}`)
        next()
    }
}

export { isLoggedIn }