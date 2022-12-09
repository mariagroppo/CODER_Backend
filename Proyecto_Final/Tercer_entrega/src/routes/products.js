import express from 'express';
const router = express.Router();
import { requireAuthentication } from '../middlewares/authentication.js';

/* El usuario tiene acceso a la lista de productos unicamente.
El admin puede, además, acceder a la sección "Edición de productos". */

import { getAllProducts, deleteProductById, editProducts, addNewProduct, showProductById, updateProductById, updateProductByIdTable } from "../controllers/productsController.js"
router.get('/', requireAuthentication, getAllProducts)  //Vista de todos los productos 
router.get('/edicionProductos', requireAuthentication, editProducts); // Vista de formularios para administrador o dueño del producto
router.post('/edicionProductos', requireAuthentication, addNewProduct); // Agrega nuevo producto
router.post('/delete', requireAuthentication, deleteProductById); //Elimina un producto segùn su id
/* router.get('/:id', requireAuthentication, showProductById);// devuelve un producto segùn su id */
router.post('/updateForm', requireAuthentication, updateProductByIdTable); //  va al form para cargar actualización
router.post('/update', requireAuthentication, updateProductById); //  recibe y actualizA UN producto segun su id.

/* import { loggerConsole, loggerArchiveWarn  } from "../../server.js";
router.get('*', (req, res) => {
    const { url, method } = req
    loggerConsole.warn(`Ruta ${method} ${url} no implementada`)
    loggerArchiveWarn.warn(`Ruta ${method} ${url} no implementada`)
    res.send(`Ruta ${method} ${url} no está implementada`)
}) */

export default router;