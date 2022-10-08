import express from 'express';
const router = express.Router();
import fs from 'fs';
import { userName, adminLicence } from '../server.js';
import db from "../dataBases/config/options.js";

/* El usuario tiene acceso a la lista de productos unicamente.
El admin puede, además, acceder a la sección "Edición de productos". */

/* CLASSES ---------------------------------------------------------------------------- */
import ProductsFile from '../dataBases/daos/products/productsList.js';
const productsList = new ProductsFile('../Segunda_entrega/dataBases/data/listProducts.txt')

/* MONGO ----------------------------------------------------- */
import ProductMongoDB from "../dataBases/daos/products/productsMongoCRUD.js";
const productMongo = new ProductMongoDB();

/* FIREBASE ----------------------------------------------------- */
import ProductFirebase from "../dataBases/daos/products/productsFbCRUD.js";
export const productFB = new ProductFirebase();

/* GET Vista de todos los productos -------------------------------- */
router.get('/', async (req, res) => {
    let listado=[];
    if (db === "JSON File") {
        listado = JSON.parse(fs.readFileSync('../Segunda_entrega/dataBases/data/listProducts.txt', 'utf-8'));
    } else if (db === "MongoDB") {
        listado = await productMongo.getAll();
        /* console.log(listado) */
    } else if (db === "Firebase") {
        listado = await productFB.getAll();
    }

    if (listado.length>0) {
        res.render('../views/main.hbs', { prods: listado, productsExists: true, user: userName, licence: adminLicence})
    } else {
        res.render('../views/main.hbs', { prods: listado, productsExists: false, user: userName , licence: adminLicence})
    }
})

/* GET Vista de formularios para administrador --------------------- */
router.get('/edicionProductos', (req, res) => {
    if (adminLicence) {
        res.render('../views/partials/formsAdmin.hbs', {user: userName, licence: adminLicence})
    } else {
        let answerError = { error: -1, description: "Ruta no autorizada"};
        console.log("Error: " + answerError.error + ". " + answerError.description)   
        res.render('../views/partials/formsAdmin.hbs', {user: userName, licence: adminLicence}) 
    }
})

/* POST Recibe y agrega un producto --------------------------------------------------------  */
router.post('/edicionProductos', (req, res) => {
    const {title, description, code, thumbnail, price, stock} = req.body;
    let validateFields=true;
    if (title === "") {
        validateFields=false;
    }
    if (description === "") {
        validateFields=false;
    }
    if (code === "") {
        validateFields=false;
    }
    if (thumbnail === "") {
        validateFields=false;
    }
    if (price === "") {
        validateFields=false;
    }
    if (stock === "") {
        validateFields=false;
    }

    if (validateFields === true) {
        const prod = {title, description, code, thumbnail, price, stock};
        if (db === "JSON File") {
            productsList.save(prod);
        } else if (db === "MongoDB") {
            productMongo.save(prod);
        } else if (db === "Firebase") {
            productFB.save(prod);
        }
        res.redirect('/api/productos/edicionProductos');    
    } else {
        console.log("Todos los campos deben estar completos.");    
    }
    req.body.reset;
 })

 /* DELETE 'api/productos -> elimina un producto segùn su id -------------------------------- */
 router.post('/delete', (req, res) => {
     let id = req.body.id;
     let validateFields=true;
     if (id === "") {
        validateFields=false;
     }

     if (validateFields === true) {
         if (isNaN(id)){
             res.status(400).send({ error: 'El parámetro no es un número.'})    
         } else {
            if (db === "JSON File") {
                productsList.deleteById(id);
            } else if (db === "MongoDB") {
                productMongo.deleteById(id);
            } else if (db === "Firebase") {
                productFB.deleteById(id);
            }
            res.redirect('/api/productos/edicionProductos');
         }
     } else {
        console.log("El campo ID debe estar completo.")   
     }
 })

/* GET 'api/productos/:id -> devuelve un producto segùn su id */
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let prod=[];
    if (isNaN(id)){
        res.status(400).send({ error: 'El parámetro no es un número.'})    
    } else {
        if (db === "JSON File") {
            prod = productsList.getById(id);
        } else if (db === "MongoDB") {
            prod = await productMongo.getById(id);
        } else if (db === "Firebase") {
            prod = await productFB.getById(id);
        }
        
        res.render('../views/partials/lookForId.hbs', { prod: prod, productsExists: true, user:userName, licence: adminLicence})
        
    }
})

/* PUT 'api/productos/:id' -> recibe y actualizA UN producto segun su id. */
router.post('/update', (req, res) => {
    const {id, newTitle, newDescription, newCode, newThumbnail, newPrice, newStock} = req.body;
    let validateFields=true;
    if (id === "") {
        validateFields=false;
    }

    if (validateFields === true) {
        const prod = {id, newTitle, newDescription, newCode, newThumbnail, newPrice, newStock};
        if (db === "JSON File") {
            productsList.updateProducts(prod);
        } else if (db === "MongoDB") {
            productMongo.updateById(prod);
        } else if (db === "Firebase") {
            productFB.updateById(prod);
        }
        
        res.redirect('/api/productos/edicionProductos');
    } else {
        console.log("El campo ID debe estar completo.");
    }

})

export default router;