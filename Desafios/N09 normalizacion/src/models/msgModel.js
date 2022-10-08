import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    author: { type: Object, required: true },
    text: { type: String, required: true },
    dateText: { type: String, required: true}
});

export const Message = mongoose.model("messagescollection", messageSchema )