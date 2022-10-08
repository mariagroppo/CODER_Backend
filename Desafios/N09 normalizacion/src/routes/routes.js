import express from 'express';
const router = express.Router();
import { randomData } from "../mocks/faker.js";

import ProductMongoDB from "../contenedores/prodsMongoDB.js";
export const prodsMongo = new ProductMongoDB();

import MessageMongoDB from "../contenedores/msgMongoDB.js";
export const msgsMongo = new MessageMongoDB();

/* PRODUCTOS ----------------------------------------------------------------------------------------- */
router.get('/productos', async (req, res) => {
    let listado = await prodsMongo.getAll();
    if (listado.length>0) {
        res.render('../views/main.hbs', { prods: listado, productsExists: true })
    } else {
        res.render('../views/main.hbs', { prods: listado, productsExists: false })
    }
    
})

/* FAKER ----------------------------------------------------------------------------------------- */
router.get('/productos-test', (req, res) => {
    res.render('../views/main.hbs', { prods: randomData, productsExists: true })
})

/* CHAT ----------------------------------------------------------------------------------------- */
/* router.get('/chat', (req, res) => {
    res.render('../views/partials/chat.hbs')
}) */

export default router;