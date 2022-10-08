// Importación de módulos express, socket.io y http
import express from 'express';
/* import { HttpServer } from 'http'; */
import { Server } from 'socket.io';
import { databaseMySql, dbSqlite3 } from "./database/database.js";

/* const router = express.Router(); */

/* CLASSES ------------------------------------------------------------------------------------------------- */
import ArchivoMensajes from './classes/saveMessage.js';
let listadoMensajes = new ArchivoMensajes('./data/mensajes.txt', dbSqlite3, 'messages');

import ArchivoProductos from './classes/saveProducts.js';
export let listadoProductos = new ArchivoProductos('./data/productos.txt', databaseMySql, 'productsTable');

// -----------------------------------------------------------------------
import router from './routes/recursos.js';
export const app = express();
/* const httpServer = new HttpServer(app); */
/* Se le envía la constante httpServer a socket.io */
/* const io = new Server(httpServer); */

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

/* SERVIDOR ------------------------------------------------------------------------------------ */
const puerto = process.env.PORT || 8080;
/* httpServer.listen(puerto, () => {console.log(`servidor escuchando en http://localhost:${puerto}`)});
httpServer.on('error', error => {console.log('error en el servidor:', error);}); */
/* module.exports = httpServer; */
export const server = app.listen(puerto, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`);
  });
  
server.on("error", (error) => console.log(`Error en servidor: ${error}`));
const io = new Server(server);

/* CONFIGURACION DE HANDLEBARS ------------------------------------------------------------------ */
import { engine } from 'express-handlebars';
app.set('view engine', 'hbs');
app.engine('hbs',engine( {
    extname: '.hbs', // Extensión a utilizar
    defaultLayout: 'index.hbs', // Plantilla principal
    layoutsDir: './views/layouts', // Ruta de la plantilla principal
    partialsDir: './views/partials' // Ruta de las plantillas parciales
} ));

/* SOCKETS ----------------------------------------------------------------------------------------- */
import fs from 'fs';
let messages=JSON.parse(await listadoMensajes.getAll());
let listado = JSON.parse(fs.readFileSync('./data/productos.txt', 'utf-8'));

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');
    listado = JSON.parse(fs.readFileSync('./data/productos.txt', 'utf-8'));
    
    socket.emit('listado', listado);
    socket.emit('currentChat', messages);

    socket.on('saveMessage', message => {
        messages.push(message);
        listadoMensajes.save(message);
        io.sockets.emit('currentChat', messages);
    })

    socket.on('newProduct', newProduct => {
        listadoProductos.save(newProduct);
        io.sockets.emit('listado', listado);        
    })

    socket.on('deleteId', deleteId => {
      listadoProductos.deleteById(deleteId);
      io.sockets.emit('listado', listado);        
    })

    socket.on('productUpdated', productUpdated => {
      listadoProductos.updateProduct(productUpdated);
      io.sockets.emit('listado', listado);        
    })

    /* socket.on('filterId', filterId => {
      let filProduct = listadoProductos.filterById(filterId);
      io.sockets.emit('filProduct', filProduct);        
    }) */

});
