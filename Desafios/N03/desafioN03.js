/* Desafio N03 */
const Archivo = require('./claseArchivo.js');
const express = require('express');

let listadoObjetos = new Archivo('./productos.txt');
const app=express();
const PORT=8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port} usando express`);
})

server.on("error", e=> console.log(`Error en el servidor ${e}`));

/* Ruta get '/productos' que devuelva un array con todos los productos disponibles en el servidor */
app.get('/productos', async (req, res) => {
    const arrayProductos = await listadoObjetos.getAll();
    res.send(arrayProductos)
    
})

/* Ruta get '/productoRandom' que devuelva un producto elegido al azar entre todos los productos 
disponibles
 */
app.get('/productosRandom', async (req, res) => {
    const arrayProductos = await listadoObjetos.getAll();
    const number = Math.floor(Math.random() * arrayProductos.length);
    res.send(arrayProductos[number]);
})