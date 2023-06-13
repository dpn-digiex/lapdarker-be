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
    type: { type: String, default: 'monitor' },
    suit: {type: Array},
    configuration: {
        brand: String, 
        size: String,
        resolution: String,
        ratio: String,
        surface: String,
        panel: String,
        refreshRate: String,
        coverage: String
    },
}, {
    timestamps: true,
})

export const MonitorModel = mongoose.model('Monitor', schema);