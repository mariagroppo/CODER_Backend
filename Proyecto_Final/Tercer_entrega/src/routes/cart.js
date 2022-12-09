import express from 'express';
const routerCart = express.Router();
import { requireAuthentication } from '../middlewares/authentication.js';

/* El cliente puede acceder a la sección "Carrito" y:
 1. Crear un nuevo carrito.
 2. Borrar carrito (siempre y cuando le pertenezca).
 3. Ver el contenido de un carrito (siempre y cuando le pertenezca).
 4. Incluir productos a un carrito (siempre y cuando le pertenezca).
NO puede acceder a la sección "Listado de carritos".
 El admin puede hacer todo. */

import { getAllCarts, listAllCarts, createNewCart, deleteCartById, listCartContent, includeProductById, buyCart } from "../controllers/cartControllers.js";
routerCart.get('/', requireAuthentication, getAllCarts) //Vista de tableros de control de carritos
routerCart.get('/listado', requireAuthentication, listAllCarts); // Listado de carritos creados
routerCart.post('/', requireAuthentication, createNewCart); // Crea nuevo carrito
routerCart.post('/delete', requireAuthentication, deleteCartById); //Elimina un carrito segùn su id
routerCart.post('/list', requireAuthentication, listCartContent); //Muestra contenido de carrito por ID. 
routerCart.post('/include', requireAuthentication, includeProductById); //Incluye productos por ID
routerCart.post('/buy', requireAuthentication, buyCart); //Da la opcion de cerrar el carrito

/* import { loggerConsole, loggerArchiveWarn  } from "../../server.js";
routerCart.get('*', (req, res) => {
    const { url, method } = req
    loggerConsole.warn(`Ruta ${method} ${url} no implementada`)
    loggerArchiveWarn.warn(`Ruta ${method} ${url} no implementada`)
    res.send(`Ruta ${method} ${url} no está implementada`)
}) */

export default routerCart;