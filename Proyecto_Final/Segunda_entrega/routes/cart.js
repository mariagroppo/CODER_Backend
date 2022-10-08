import express from 'express';
const routerCart = express.Router();
import fs from 'fs';
import { userName, adminLicence } from '../server.js';
import db from "../dataBases/config/options.js";

/* El cliente puede acceder a la sección "Carrito" y:
 1. Crear un nuevo carrito.
 2. Borrar carrito (siempre y cuando le pertenezca).
 3. Ver el contenido de un carrito (siempre y cuando le pertenezca).
 4. Incluir productos a un carrito (siempre y cuando le pertenezca).
NO puede acceder a la sección "Listado de carritos".
 El admin puede hacer todo. */

/* CLASSES ---------------------------------------------------------------------------- */
import CartsFile from '../dataBases/daos/carts/cartList.js';
const cartList = new CartsFile('../Segunda_entrega/dataBases/data/listCarts.txt')

/* MONGO ----------------------------------------------------- */
import CartMongoDB from "../dataBases/daos/carts/cartsMongoCRUD.js";
const cartMongo = new CartMongoDB();

/* FIREBASE ----------------------------------------------------- */
import CartFirebase from "../dataBases/daos/carts/cartsFbCRUD.js";
const cartFB = new CartFirebase();

/* GET Vista de todos los formularios -------------------------------- */
routerCart.get('/', (req, res) => {
    res.render('../views/partials/carts.hbs', {user: userName, licence: adminLicence})
})

/* Listado de carritos creados ---------------------------------------- */
routerCart.get('/listado', async (req, res) => {
    let listado=[];
    if (db === "JSON File") {
        listado = JSON.parse(fs.readFileSync('../Segunda_entrega/dataBases/data/listCarts.txt', 'utf-8'));
    } else if (db === "MongoDB") {
        listado = await cartMongo.getAllCarts();
    } else if (db === "Firebase") {
        listado = await cartFB.getAll();
    }
        
    if (adminLicence) {
        if (listado.length>0) {
            res.render('../views/partials/listadoCarts.hbs', { carts: listado, cartsExists: true, user: userName, licence: adminLicence})
        } else {
            res.render('../views/partials/listadoCarts.hbs', { carts: listado, cartsExists: false, user: userName, licence: adminLicence})
        }
    } else {
        let answerError = { error: -1, description: "Ruta no autorizada"};
        console.log("Error: " + answerError.error + ". " + answerError.description)   
        res.render('../views/partials/listadoCarts.hbs', { carts: listado, cartsExists: false, user: userName, licence: adminLicence})
    }
})

/* Para crear un carrito --------------------------------------------------------  */
routerCart.post('/', (req, res) => {
    if (db === "JSON File") {
        cartList.createCart(userName);
    } else if (db === "MongoDB") {
        cartMongo.createCart(userName);
    } else if (db === "Firebase") {
        cartFB.createCart(userName);
    }
    res.redirect('/api/cart');
 })

 /* Elimina un carrito segùn su id -------------------------------- */
 routerCart.post('/delete', (req, res) => {
     let id = parseInt(req.body.idCart);
     if (isNaN(id)){
         res.status(400).send({ error: 'El parámetro no es un número.'})    
     } else {
        if (db === "JSON File") {
            cartList.deleteById(id, userName);
        } else if (db === "MongoDB") {
            cartMongo.deleteById(id, userName);
        } else if (db === "Firebase") {
            cartFB.deleteById(id, userName);
        }
        res.redirect('/api/cart');
    }
 })

/* Contenido de carrito por ID. */
routerCart.post('/list', async (req, res) => {
    let id = parseInt(req.body.idCart);
    let cart = [];
    let exists=false;
    let prodsCart=[];
     if (isNaN(id)){
         res.status(400).send({ error: 'El parámetro no es un número.'})    
     } else {
         if (db === "JSON File") {
            /* devuelve el carrito completo CART, si tiene productos PRODSCART y si el carrito existe EXISTS*/
            cart = cartList.getById(id, userName).obj;
            prodsCart=cartList.getById(id, userName).prodsCart;
            exists=cartList.getById(id, userName).exists;
        } else if (db === "MongoDB") {
            let resp = await cartMongo.listById(id, userName);
            cart = resp.cartToBeListed;
            prodsCart=resp.prodsCart;
            exists=resp.exists;
        } else if (db === "Firebase") {
            let resp = await cartFB.listById(id, userName);
            cart = resp.cartToBeListed;
            prodsCart=resp.prodsCart;
            exists=resp.exists;
        }
                
        /* Si el carrito existe y es del usuario, lo muestro */
        let access=true;
        if (exists) {
            if (cart.user === userName || userName === "admin") {
                res.render('../views/partials/cartContainer.hbs', { carts: cart, cartsExists: true, pExist: prodsCart, user: userName, licence: access})
            } else {
                access=false;
                res.render('../views/partials/cartContainer.hbs', { carts: [], cartsExists: false, pExist:false, user: userName, licence: adminLicence})
            }
        } else {
            console.log("El carrito no existe.");
            res.redirect('/api/cart');
        }
             
        
     }
})

/* Incluir productos por ID */
routerCart.post('/include', async (req, res) => {
    /* FALTA INCLUIR CANTIDAD Y QUE AL AGREGAR MISMO ID SUME LA CANTIDAD. */
    const {idCart, id } = req.body;
    if (isNaN(idCart)){
        res.status(400).send({ error: 'El Id del carrito no es un número.'})    
    } else {
        if (isNaN(id)){
            res.status(400).send({ error: 'El Id del producto no es un número.'})    
        } else {
            if (db === "JSON File") {
                cartList.includeProductById(idCart, id, userName);
            } else if (db === "MongoDB") {
                await cartMongo.includeProductById(idCart, id, userName);
            } else if (db === "Firebase") {
                await cartFB.includeProductById(idCart, id, userName);
            }
            
            res.redirect('/api/cart');
        }    
    }
})

export default routerCart;