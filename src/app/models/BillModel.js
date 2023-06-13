import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    fullname: { type: String },
    address: { type: String },
    phone: { type: String },
    products: { type: Array },
    totalPrice: { type: Number },
    totalItems: { type: Number },
    payment: { type: String },
    state: { type: String },
    idUser: { type: String }
  },
  {
    timestamps: true
  }
);
export const BillModel = mongoose.model('Bill', schema);
