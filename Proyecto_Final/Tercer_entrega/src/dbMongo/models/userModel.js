import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address:{ type: String, required: true },
    age:{ type: Number, required: true },
    phoneNumber:{ type: Number, required: true },
    avatar:{ type: String, required: true }    
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.validatePassword = function ( password ) {
    return bcrypt.compareSync(password, this.password);
} 

export const User = mongoose.model("userscollection", userSchema )