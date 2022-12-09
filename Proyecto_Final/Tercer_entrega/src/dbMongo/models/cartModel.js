import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    idCart: { type: Number, required: false },
    timestamp: { type: Date, default: Date.now },
    user: { type: String, required: true },
    products: { type: Array, required: true },
    cartStatus: { type: Boolean, required: true }
});

export const CartModel = mongoose.model("cartsCollection", cartSchema);