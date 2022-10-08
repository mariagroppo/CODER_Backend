 const express = require('express');
 const router = express.Router();

 const Productos = require('../api/productos');
 const productos = new Productos();
 
/* GET 'api/productos' -> devuelve todos los productos. */
router.get('/', (req, res) => {
    let listado = productos.getProducts();
    if (listado.length === 0) {
        res.send({ error: "No hay productos cargados" })
    } else {
        return res.json(listado);
    }
})

/* GET 'api/productos/:id -> devuelve un producto segùn su id */
router.get('/:id', (req, res) => {
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
})

/* POST 'api/productos -> Recibe y agrega un producto y lo devuelve con su id asignado. */
router.post('/', (req, res) => {
     productos.saveProduct(req.body.title, req.body.price, req.body.ruta);
     return res.json({ estado: 'GUARDADO' });
 })
 

/* DELETE 'api/productos/:id -> elimina un producto segùn su id. */
router.delete('/delete/:id', (req, res) => {
    let listado = productos.getProducts();
    let id = req.params.id;
    if (isNaN(id)){
        res.status(400).send({ error: 'El parámetro no es un número.'})
        return    
    } else {
        if (id > listado.length) {
            res.status(400).send({ error: 'Producto no encontrado.'});
        } else {
            productos.deleteProduct(id);
            return res.json({ estado: 'BORRADO' });
        }
    }
})

/* PUT 'api/productos/:id' -> recibe y actualizA UN producto segun su id. */
router.put('/update/:id', (req, res) => {
    let { title, price, thumbnail } = req.body;
    let index = productos.findIndex(producto => producto.id === Number(req.params.id));
    if (index >= 0) {
        productos[index] = { title, price, thumbnail };
        productos[index].id = Number(req.params.id);
        res.send(productos[index]);
    } else {
        res.status(404).send({ error: 'Producto no encontrado' });
    }
})

/* let searchId = () =>{
    let inputValue = document.getElementById("idSearch").value; 
    documents.forms['formSearch'].action = "/api/productos/" + inputValue;
    document.forms['formSearch'].submit();
  } */

module.exports = router;