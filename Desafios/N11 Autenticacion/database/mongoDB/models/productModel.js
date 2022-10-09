import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id:{ type: Number, required: false },
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true },
});

export const Product = mongoose.model("productscollection", productSchema )