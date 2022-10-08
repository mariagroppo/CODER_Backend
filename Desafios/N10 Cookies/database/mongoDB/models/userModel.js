import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: string, required: true },
    password: { type: string, required: true }    
});

export const User = mongoose.model("userscollection", userSchema )