const express = require('express');
const router = express.Router();
const fs = require ('fs');

/* CHAT ----------------------------------------------------------------------------------------------. */
router.get('/chat', (req, res) => {
    res.render('../views/partials/chat.hbs')
})

router.get('/productos', (req, res) => {
    res.render('../views/main.hbs')
})
/* PRODUCTOS ----------------------------------------------------------------------------------------- */

/* const Productos = require('../classes/productos');
const productos = new Productos() */

/* GET 'api/productos' -> devuelve todos los productos. */
/* router.get('/productos', async (req, res) => {
    
    try {
        const contenido = await fs.promises.readFile('./data/productos.txt', 'utf-8');
        console.log("contenido");
        console.log(contenido);
        if (contenido.length>0) {
            res.render('../views/main.hbs', { prods: contenido, productsExists: true})
        } else {
            res.render('../views/main.hbs', { prods: contenido, productsExists: false})
        }
        
        
    } catch (error) {
        console.log('Error de lectura!', error);
    }
    
    
})
 */
/* GET 'api/productos/:id -> devuelve un producto segùn su id */
/* router.get('/:id', (req, res) => {
    let listado = productos.getProducts();
    let id = req.params.id;

    if (isNaN(id)){
        res.status(400).send({ error: 'El parámetro no es un número.'})
        return    
    } else {
        if (id > listado.length) {
            res.status(400).send({ error: 'Producto no encontrado.'});
        } else {
            let producto = productos.listProduct(id);
            if (producto == null) {
                res.send({ error: "Producto no encontrado" })
            } else {
                res.json(producto)
            }
        }
    }
}) */

/* POST 'api/productos -> Recibe y agrega un producto y lo devuelve con su id asignado. */
/* router.post('/', (req, res) => {
    productos.saveProduct(req.body.title, req.body.price, req.body.ruta);
    res.redirect('/api/productos')
 }) */
 

/* DELETE 'api/productos -> elimina un producto segùn su id. */
/* router.post('/delete', (req, res) => {
    let listado = productos.getProducts();
    let id = req.body.id;
    if (isNaN(id)){
        res.status(400).send({ error: 'El parámetro no es un número.'})
        return    
    } else {
        if (id > listado.length) {
            res.status(400).send({ error: 'Producto no encontrado.'});
        } else {
            productos.deleteProduct(id);
            res.redirect('/api/productos')
        }
    }
}) */

/* PUT 'api/productos/:id' -> recibe y actualizA UN producto segun su id. */
/* router.post('/update', (req, res) => {
    let listado = productos.getProducts();
    let { id, title, price, ruta } = req.body;
    let index = listado.findIndex(producto => producto.id == id);

    if (index === -1) {
        res.status(400).send({ error: 'Producto no encontrado.'});
    } else {
        if (req.body.title != "" ) {
            listado[index].title=req.body.title
        } 
        if (req.body.price != "" ) {
            listado[index].price=req.body.price
        }
        if (req.body.ruta != "" ) {
            listado[index].ruta=req.body.ruta
        }
        res.redirect('/api/productos')
    }
}) */

module.exports = router;