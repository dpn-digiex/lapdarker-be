import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';
import { BillModel } from '../models/BillModel.js';
import { LaptopModel } from '../models/LaptopModel.js';
import { MonitorModel } from '../models/MonitorModel.js';
import { KeyboardModel } from '../models/KeyboardModel.js';
import { mongooseTypeData } from '../../util/mongoose.js';
import { SECRECT_KEY } from '../middlewares/index.js';

const collections = [
  {
    name: LaptopModel.collection.collectionName,
    model: LaptopModel
  },
  {
    name: MonitorModel.collection.collectionName,
    model: MonitorModel
  },
  {
    name: KeyboardModel.collection.collectionName,
    model: KeyboardModel
  }
];

// * [POST] /orders/post
export const addOrders = async (req, res, next) => {
  let { fullname, phone, address, items, cartTotal, payment, state, token, totalItems } = req.body;
  let idUser = '';

  if (address.store.length > 0) {
    address = address.store;
  } else {
    address = `${address.personal.city}, ${address.personal.district}, ${address.personal.ward} / ${address.personal.specifyAdr}`;
  }

  if (token.length > 0) {
    jwt.verify(token, SECRECT_KEY, (err, data) => {
      if (err) console.log(err);
      else idUser = data.id;
    });
  } else idUser = 'Khách lẻ';

  try {
    const savedOrder = {
      products: items,
      totalPrice: cartTotal,
      totalItems: totalItems,
      fullname,
      address,
      phone,
      payment,
      state,
      idUser
    };
    
    const newOrders = new BillModel(savedOrder);
    const respondOrders = await newOrders.save();

    if (idUser !== 'Khách lẻ') {
      await UserModel.findByIdAndUpdate(idUser, { $push: { bill: respondOrders._id } }, { upsert: true });
    }
    
    res.status(200).json(respondOrders._id);
  } catch (error) {
    res.status(500).json(error);
  }
};

// * [GET] /orders/get?type=_order
export const getOrdersFollowType = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.token.id);
    if (user) {
      const arrOrdersId = user.bill;
      const orders = await BillModel.find({ _id: { $in: [arrOrdersId] } });
      if (orders) {
        switch (req.query.type) {
          case '1':
            const orderRespond = orders.filter(order => order.state === 'WAIT_FOR_PAY');
            console.log(orderRespond);
            break;
          case '2':
            break;
          case '3':
            break;
          case '4':
            break;
          case '5':
            break;
          default:
            break;
        }
      }
    } else res.status(401).json('UNIDENTIFY_USER');
  } catch (error) {
    res.status(500).json(error);
  }
};

// * [GET] /orders/get-all
export const getOrders = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.token.id);
    if (user) {
      const arrOrdersId = user.bill;
      const orders = await BillModel.find({ _id: { $in: arrOrdersId } });
      res.status(200).json(orders);
    } else {
      res.status(401).json('UNIDENTIFY_USER');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateOrders = async (req, res, next) => {
  console.log(req.body);
  console.log('running api >>>>>>>>>');
  const request = req.body;
  try {
    switch (request?.state) {
      case 'UPDATE_STATE_ORDER':
        const updated = await BillModel.findOneAndUpdate(
          { _id: request?.id },
          { state: request?.state },
          { upsert: true }
        );
        if (!updated) res.status(500).json('UPDATE_STATUS_ORDERS_FAILURE');
        else res.status(200).json({
          statusCode: 200,
          message: 'UPDATED SUCCESS !'
        });
        break;
      case 'TRANSPORTING':
        const transporting = await BillModel.findOneAndUpdate(
          { _id: request?.id },
          { state: 'TRANSPORTING' },
        );

        if (!transporting) res.status(500).json('UPDATE_STATUS_ORDERS_FAILURE');
        else res.status(200).json({
          statusCode: 200,
          message: 'UPDATED SUCCESS !'
        });
      break;

      case 'PROCESSING':
        const processing = await BillModel.findOneAndUpdate(
          { _id: request?.id },
          { state: 'PROCESSING' },
        )
        if (!processing) res.status(500).json('UPDATE_STATUS_ORDERS_FAILURE');
        else res.status(200).json({
          statusCode: 200,
          message: 'UPDATED SUCCESS !'
        });
      break;

      case 'DELIVERED':
        const deleiverd = await BillModel.findOneAndUpdate(
          { _id: request?.id },
          { state: 'DELIVERED' },
        )
        if (!deleiverd) res.status(500).json('UPDATE_STATUS_ORDERS_FAILURE');
        else res.status(200).json({
          statusCode: 200,
          message: 'UPDATED SUCCESS !'
        });
      break;

      case 'WAIT_FOR_PAY':
        const waitForPay = await BillModel.findOneAndUpdate(
          { _id: request?.id },
          { state: 'WAIT_FOR_PAY' },
        )
        if (!waitForPay) res.status(500).json('UPDATE_STATUS_ORDERS_FAILURE');
        else res.status(200).json({
          statusCode: 200,
          message: 'UPDATED SUCCESS !'
        });
      break;

      case 'WAIT_FOR_CONFIRM':
        const waitForConfirm = await BillModel.findOneAndUpdate(
          { _id: request?.id },
          { state: 'WAIT_FOR_CONFIRM' },
        )
        if (!waitForConfirm) res.status(500).json('UPDATE_STATUS_ORDERS_FAILURE');
        else res.status(200).json({
          statusCode: 200,
          message: 'UPDATED SUCCESS !'
        });
      break;
      default:
        return res.status(500).json('INVALID TYPE UPDATE');
    }

  } catch (error) {
    res.status(500).json(error);
  }
  
};

export const getDetailOrder = async (req, res, next) => {
  console.log('req--------------------------------->',req.params);
  const id = req.params.id;
  try {
        const detailOrder = await BillModel.findOne(
          { _id: id },
        );
        if (!detailOrder) res.status(500).json('ORDER NOT EXIST');
        else res.status(200).json(detailOrder);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteOrders = async (req, res,next) => {
  const id = req?.body.id
  try {
    if (mongooseTypeData.checkType(id) === 'array') {
      const deleteOrders = await BillModel.deleteMany({
        _id: { $in: id}
      });
      console.log('deleteOrders >>>>>>>>' ,deleteOrders);
      if (deleteOrders.deletedCount > 0) {
        return res.status(200).json({
          message: 'Delete Sucessful !',
          statusCode: 200
        });
      }
      return  res.status(500).json({
        message: 'Delete fail !',
        statusCode: 500
      }); 
    }

    if (mongooseTypeData.checkType(id) === 'string') {
      const deleteOrder = await BillModel.deleteOne({
        _id: id
      });     
      if (deleteOrder.deletedCount > 0) {
        return res.status(200).json({
          message: 'Delete Sucessful !',
          statusCode: 200
        });
      }
      return  res.status(500).json({
        message: 'Delete fail !',
        statusCode: 500
      }); 
    }

  } catch(e) {
    res.status(500).json('Server Error !');
  }
};
