import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const SECRECT_KEY = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_KEY = process.env.REFRESH_TOKEN_SECRET;
// const REFRESH_KEY = process.env.REFRESH_TOKEN_SECRET;
export const verifyToken = (req, res, next) => {
    // token phía client gửi lên user có dạng 'Bearer [token]'
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader) {
        return res.status(401).json("UNAUTHORIZED_ERROR");
    } 
    const token = authorizationHeader.split(" ")[1];

    if (!token) return res.status(401).json("UNAUTHORIZED_ERROR");
    try {
        jwt.verify(token, SECRECT_KEY, (err, data) => {
            if (err) return res.status(403).json("EXPIRED_TOKEN");
            req.token = data;
            next();
        });
    } catch (error) {
        console.log(error);
        return res.status(403).json("FORBIDDEN_ERROR");
    }
}

