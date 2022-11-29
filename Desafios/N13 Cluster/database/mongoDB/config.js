/* MONGOOSE ---------------------------------------- */
import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const URL = process.env.URL_MONGO;

export async function connection () {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log("Conectado a Mongo");
    } catch (error) {
        console.log(error);
    }
}