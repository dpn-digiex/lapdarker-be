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
    type: { type: String, default: 'laptop' },
    suit: { type: Array},
    configuration: {
        brand: { type: String },
        CPU: { type: String },
        RAM: { type: String },
        monitor: { type: String },
        card_graphic:{ type: String},
        storage: { type: String },
        PIN: { type: String },
        ports: { type: String },
        detailed_size: {
            height: { type: String },
            width: { type: String },
            thickness: { type:String}
        },
        weight: { type: String },
        material: { type: String },
        operators: { type: String }
    },
}, {
    timestamps: true,
})

export const LaptopModel = mongoose.model('Laptop', schema);