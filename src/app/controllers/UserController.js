import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';
import { RefreshTokenModel } from '../models/RefreshTokenModel.js';
import { BillModel } from '../models/BillModel.js';
import { generateAccessToken, generateRefreshToken } from '../../util/jwt.js';
import { mongooseTypeData } from '../../util/mongoose.js';
import { REFRESH_KEY, SECRECT_KEY } from '../middlewares/index.js';
// * [POST] /user/post-login

export const postInfoUserLogin = async (req, res, next) => {
  try {
    const data = req.body;
    if (!data.password) {
      const findUser = await UserModel.findOne({ phone: data.phone });
      // * Nếu có user thì tiến hành bước tiếp theo -> nhập password
      if (findUser) {
        res.status(200).json('NEXT_STEP_AUTHENTICATION');
      }
      // * Nếu chưa có thì yêu cầu người dùng tạo PASSWORD
      else {
        res.status(200).json('CREATE_PASSWORD');
      }
    } else {
      switch (data.state_request) {
        case 'LAST_AUTHENTICATION':
          const user = await UserModel.findOne({ phone: data.phone });
          try {
            if (await bcrypt.compare(data.password, user.password)) {
              let { password, updatedAt, createdAt, __v, role, ...newData } = mongooseTypeData.mongooseToObject(user);
              newData = role === 'admin' ? { ...newData, role } : newData;
              const accessToken = generateAccessToken(newData._id);
              const checkUserIdOnRefreshTokenDB = await RefreshTokenModel.findOne({ user: user._id });
              if (!checkUserIdOnRefreshTokenDB) {
                const refreshToken = new RefreshTokenModel({
                  token: generateRefreshToken(newData._id),
                  user: newData._id
                });
                await refreshToken.save();
              }
              res.status(200).json({
                status: 'LOGIN_SUCCESS',
                user: { ...newData },
                token: accessToken
              });
            } else res.status(200).json({ status: 'WRONG_PASSWORD' });
          } catch (error) {
            res.status(500).json({ error: error });
          }
          break;
        case 'CREATE_NEW_ACCOUNT':
          // * Hashing password to save DB
          const salt = await bcrypt.genSalt(10);
          const hashedPass = await bcrypt.hash(data.password, salt);
          const newUser = new UserModel({ phone: data.phone, password: hashedPass });
          const respondUser = await newUser.save();

          // * cut password and send data to client
          const { password, updatedAt, createdAt, __v, role, ...newData } =
            mongooseTypeData.mongooseToObject(respondUser);
          const accessToken = generateAccessToken(newData._id);
          const refreshToken = new RefreshTokenModel({
            token: generateRefreshToken(newData._id),
            user: newData._id
          });
          await refreshToken.save();
          res.status(200).json({
            status: 'REGISTER_SUCCESS',
            user: { ...newData },
            token: accessToken
          });
          break;
        default:
          break;
      }
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
// * [POST] /user/logout
export const logOut = (req, res, next) => {
  console.log(req.token);
};

// * [POST] /user/refresh-access-token
export const generateNewAccessToken = async (req, res, next) => {
  try {
    const userId = req.body.id;
    if (!userId) res.status(401).json('UNAUTHORIZED_ERROR');
    const refreshToken = await RefreshTokenModel.findOne({ user: userId });
    if (!refreshToken) res.status(500).json('REQUIRED_LOGIN');
    else {
      jwt.verify(refreshToken.token, REFRESH_KEY, (err, data) => {
        if (err) res.status(403).json('REQUIRED_LOGIN');
        const newAccessToken = generateAccessToken(data.user);
        res.status(200).json(newAccessToken);
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    if (req.token) {
      const orders = await BillModel.find({});
      res.status(200).json(orders);
    } else res.status(403).json('WRONG_TOKEN');
  } catch (error) {
    res.status(500).json(error);
  }
};
