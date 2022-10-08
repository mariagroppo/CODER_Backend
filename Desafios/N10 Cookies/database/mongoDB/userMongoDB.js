import { User } from "../mongoDB/models/userModel.js";

class UserMongoDB {
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async () => {
        
        try {
            const contenido = await User.find().lean()
            let contenido2=contenido;
            for (let i = 0; i < contenido.length; i++) {
                contenido2[i]._id = contenido[i]._id.toString();
            }
            return contenido2;
            
        } catch (error) {
            console.log('Error de lectura!', error);
            let cont=[];
            return cont;
        }
    } 

    save = async (email, password) => {
        const userData = {email: email, password: password};
        /* console.log(newMessage) ; */
        const newUser = new User(userData);
        try {
            /* console.log(newMes); */
            await newUser.save();
        } catch (error) {
            console.log(error);
        }
    } 

    /* Para verificar que el correo existe*/
    verifyEmail = async () => {
        try {
            
            return true;
        } catch (error) {
            
        }
    }
    
    /* Para verificar que la pass coincide con el email */
    verifyPass= async (email) => {
        try {
            
            return true;
        } catch (error) {
            
        }
    }
}

export default UserMongoDB;