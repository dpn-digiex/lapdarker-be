import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    phone: { type: String, required: true},
    password: { type: String, required: true},
    address: { type: String, default:'' },
    email: { type: String, default: '' },
    role: { type: String , default: 'customer' },
    fullname: { type: String, default: ''},
    bill: { type: Array, default: [] },
}, {
    timestamps: true
});

export const UserModel = mongoose.model('User', schema);
