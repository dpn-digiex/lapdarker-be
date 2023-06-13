import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: Array },
    video: { type: Array },
    sku: { type: String },
    original_price: { type: mongoose.Types.Decimal128, required: true },
    sale: { type: mongoose.Types.Decimal128 },
    quantity: { type: Number, required: true },
    color: { type: String},
    type: { type: String, default: 'keyboard' },
    suit: {type: Array},
    configuration: {
        brand:String,
        typeKeyboard:String,
        compatible: String,
        layout:String,
        switch: String,
        keycap:String,
    },
}, {
    timestamps: true,
})

export const KeyboardModel = mongoose.model('Keyboard', schema);