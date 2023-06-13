import mongoose from "mongoose";

const schema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
});

export const RefreshTokenModel = mongoose.model('RefreshToken', schema);