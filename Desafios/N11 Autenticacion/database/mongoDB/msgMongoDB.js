import { Message } from "../mongoDB/models/msgModel.js";

class MessageMongoDB {
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async () => {
        
        try {
            const contenido = await Message.find().lean()
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

    save = async (newMessage) => {
        
        /* console.log(newMessage) ; */
        const newMes = new Message(newMessage);
        try {
            /* console.log(newMes); */
            await newMes.save();
        } catch (error) {
            console.log(error);
        }
    } 

    
}

export default MessageMongoDB;