/* MONGO ----------------------------------------------------- */
import CartMongoDB from "../dbMongo/cruds/cartsMongoCRUD.js";
const cartMongo = new CartMongoDB();
import {mailProducts} from "../mail/nodemailer.js"
import { sendWhatsApp } from "../mail/twilioWp.js";
import dotenv from "dotenv";
import { sendSMS } from "../mail/twilioSMS.js";
dotenv.config();

/* GET Vista de todos los carritos -------------------------------- */
export const getAllCarts = async (req, res) => {
    try {
        let userState = req.isAuthenticated();
        let userName = req.user.userName;
        let avatar = req.user.avatar;
        let adminLicence =false;
        if (userName === "admin") {
            adminLicence =true;
        }
        res.render('../src/views/partials/carts.hbs', {user: userName, adminLicence: adminLicence, userStatus: userState, avatar: avatar});
    } catch (error) {
        console.log("Error en getAllCarts: " + error)    
    }
}

export const listAllCarts = async (req, res) => {
    try {
        let listado = await cartMongo.getAllCarts();
        let userState = req.isAuthenticated();
        let userName = req.user.userName;
        let avatar = req.user.avatar;
        let adminLicence =false;
        if (userName === "admin") {
            adminLicence =true;
        } else {
            const filtro = listado.filter(a => a.user === userName);
            listado = filtro;
        }
        if (listado.length>0) {
            res.render('../src/views/partials/listadoCarts.hbs', { carts: listado, cartsExists: true, adminLicence: adminLicence, userStatus: userState, avatar: avatar})
        } else {
            res.render('../src/views/partials/listadoCarts.hbs', { carts: listado, cartsExists: false, adminLicence: adminLicence, userStatus: userState, avatar: avatar})
        }
    } catch (error) {
        console.log("Error al listar productos: " + error)
    }
}

export const createNewCart = async (req, res) => {
    try {
        let userName = req.user.userName;
        cartMongo.createCart(userName);
        res.redirect('/api/cart');
    } catch (error) {
        console.log("Error en createNewCart: " + error);    
    }
 }

export const deleteCartById = async (req, res) => {
    try {
        let id = parseInt(req.body.idCart);
        let userName = req.user.userName;
        if (isNaN(id)){
            res.status(400).send({ error: 'El parámetro no es un número.'})    
        } else {
           await cartMongo.deleteById(id, userName);
           res.redirect('/api/cart');
       }
        
    } catch (error) {
        console.log("Error al querer borrar el carrito: " + error)
    }
}

export const listCartContent = async (req, res) => {
    try {
        let id = parseInt(req.body.idCart);
        let userName = req.user.userName;
        let userState = req.isAuthenticated();
        let avatar = req.user.avatar;
        let adminLicence =false;
        if (userName === "admin") {
            adminLicence =true;
        }
        let cart = [];
        let exists=false;
        let prodsCart=[];
         if (isNaN(id)){
             res.status(400).send({ error: 'El parámetro no es un número.'})    
         } else {
            let resp = await cartMongo.listById(id, userName);
            cart = resp.cartToBeListed;
            prodsCart=resp.prodsCart;
            exists=resp.exists;
                            
            /* Si el carrito existe y es del usuario, lo muestro */
            let access=true;
            if (exists) {
                if (cart.user === userName || userName === "admin") {
                    res.render('../src/views/partials/cartContainer.hbs', { carts: cart, cartsExists: true, pExist: prodsCart, adminLicence: adminLicence, userStatus: userState, avatar: avatar})
                } else {
                    access=false;
                    res.render('../src/views/partials/cartContainer.hbs', { carts: [], cartsExists: false, pExist:false, adminLicence: adminLicence, userStatus: userState, avatar: avatar})
                }
            } else {
                console.log("El carrito no existe.");
                res.redirect('/api/cart/listado');
            }
        }
    } catch (error) {
        console.log("Error en listCartContent: " + error); 
    }
}

export const includeProductById = async (req, res) => {
    /* FALTA INCLUIR CANTIDAD Y QUE AL AGREGAR MISMO ID SUME LA CANTIDAD. */
    try {
        const {idCart, id } = req.body;
        let userName = req.user.userName;
        if (isNaN(idCart)){
            res.status(400).send({ error: 'El Id del carrito no es un número.'})    
        } else {
            if (isNaN(id)){
                res.status(400).send({ error: 'El Id del producto no es un número.'})    
            } else {
                await cartMongo.includeProductById(idCart, id, userName);
                res.redirect('/api/cart/listado');
            }    
        }
    } catch (error) {
        console.log("Error en includeProductById: " + error)    
    }
}

export const buyCart = async (req, res) => {
    try {
        const id = req.body.id;
        let userName = req.user.userName;
        let userMail = req.user.email;
        let userPhone = req.user.phoneNumber;
        if (isNaN(id)){
            res.status(400).send({ error: 'El Id del carrito no es un número.'})    
        } else {
            /* PRIMERO cierro el carrito.*/
            await cartMongo.closeCart(id, userName);
            let productos = await cartMongo.listById(id, userName);
            /* SEGUNDO: Ver de agregar un botón que sea repetir compra. */
            /* TERCERO: Mando mail al admin y al usuario*/
            await mailProducts(productos, userName, userMail)
            
            /* CUARTO: Aviso al admin por whatsapp que hay nuevo pedido */
            const options = {
                body: 'Nuevo pedido de ' + userName,
                from: "whatsapp:+14155238886",
                to: "whatsapp:+5491136254208"
            };
            await sendWhatsApp(options);
            
            /*  quinto: Mensaje SMS al usuario con mensaje de compra */
            userPhone='+5491136254208';
            await sendSMS("+12057493470", userPhone);
            /* sexto: resto del stock ------------- */
            await cartMongo.stockUpdate(productos);
            
            res.redirect('/api/cart/listado');
            

        }
        
    } catch (error) {
        console.log("Error en buy Cart: " + error)
    }

}