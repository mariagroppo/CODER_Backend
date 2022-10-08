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
            console.log("useMongoDB -----------------------------------------------------------------------------")
            console.log({contenido});
            return contenido2;
            
        } catch (error) {
            console.log('Error de lectura!', error);
            let cont=[];
            return cont;
        }
    } 

    save = async (email, password, userName) => {
        try {
            const user = new User();
            user.email = email;
            user.password = user.encryptPassword(password);
            user.userName = userName;
            /* save es una función asincrona */
            await user.save();
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    } 

    /* Para verificar que el correo existe*/
    verifyEmail = async (email) => {
        try {
            /* Si el usuario existe devuelve true */
            let usuarios = await this.getAll();
            const usuario = usuarios.find(u => u.email === email);
            /* console.log("verify mail - useMongoDB -------------------------------------------------------")
            console.log({usuario}); */
            if (usuario) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    
    updateId = async () => {
        try {
            const contenido = await User.find().lean()
            let contenido2 = contenido;
            for (let i = 0; i < contenido.length; i++) {
                contenido2[i]._id = contenido[i]._id.toString();
            }
            User.remove({});

            for (let i = 0; i < contenido2.length; i++) {
                let user = new User(contenido2[i]);
                await user.save()
            }
            
            
        } catch (error) {
            console.log('Error de lectura!', error);
            
        }
    }
    
    showUser = async (email) => {
        try {
            let user = await User.findOne({email: email});
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    } 
}

export default UserMongoDB;
export const userMongo = new UserMongoDB();