/* MONGOOSE ---------------------------------------- */
import mongoose from 'mongoose';

export async function connection () {
    try {
        await mongoose.connect("mongodb://localhost:27017/desafio11", {
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log("Conectado a Mongo");
    } catch (error) {
        console.log(error);
    }
}