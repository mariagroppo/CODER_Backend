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
            /* console.log("useMongoDB -----------------------------------------------------------------------------")
            console.log({contenido}); */
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
            // console.log(await this.getAll())
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
    
    showUser = async (email) => {
        try {
            let user = await User.findOne({email: email});
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    showUserName = async (code) => {
        try {
            let users = await this.getAll();
            const user = users.find(u => u._id === code);
            if (user) {
                return user.userName
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    } 
}

export default UserMongoDB;
export const userMongo = new UserMongoDB();