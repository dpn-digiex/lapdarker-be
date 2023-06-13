import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const SECRECT_KEY = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_KEY = process.env.REFRESH_TOKEN_SECRET;
export const generateAccessToken = id => {
  return jwt.sign({ id: id }, SECRECT_KEY, { expiresIn: '5d' });
};

export const generateRefreshToken = id => {
  return jwt.sign({ id: id }, REFRESH_KEY, { expiresIn: '10d' });
};
