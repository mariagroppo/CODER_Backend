// Importación de módulos express, socket.io y http
const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

/* const router = express.Router(); */

/* CLASSES ------------------------------------------------------------------------------------------------- */
const ArchivoMensajes = require('./classes/saveMessage.js');
let listadoMensajes = new ArchivoMensajes('./data/mensajes.txt');

const ArchivoProductos = require('./classes/saveProducts.js');
let listadoProductos = new ArchivoProductos('./data/productos.txt');

// -----------------------------------------------------------------------
const router = require('./routes/recursos.js');
const app = express();
const httpServer = new HttpServer(app);
/* Se le envía la constante httpServer a socket.io */
const io = new IOServer(httpServer);

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

/* SERVIDOR ------------------------------------------------------------------------------------ */
const puerto = 8080;
httpServer.listen(puerto, () => {console.log(`servidor escuchando en http://localhost:${puerto}`)});
httpServer.on('error', error => {console.log('error en el servidor:', error);});
module.exports = httpServer;

/* CONFIGURACION DE HANDLEBARS ------------------------------------------------------------------ */
const { engine } = require('express-handlebars');
app.set('view engine', 'hbs');
app.engine('hbs',engine( {
    extname: '.hbs', // Extensión a utilizar
    defaultLayout: 'index.hbs', // Plantilla principal
    layoutsDir: __dirname + '/views/layouts', // Ruta de la plantilla principal
    partialsDir: __dirname + '/views/partials' // Ruta de las plantillas parciales
} ));

/* SOCKETS ----------------------------------------------------------------------------------------- */
const fs = require ('fs');
const messages=JSON.parse(fs.readFileSync('./data/mensajes.txt', 'utf-8'));
let listado = JSON.parse(fs.readFileSync('./data/productos.txt', 'utf-8'));

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');

    socket.emit('listado', listado);
    socket.emit('currentChat', messages);

    socket.on('saveMessage', message => {
        messages.push(message);
        listadoMensajes.save(message);
        io.sockets.emit('currentChat', messages);
    })

    socket.on('newProduct', newProduct => {
      console.log(newProduct);
      listadoProductos.save(newProduct);
      console.log("listado");
      console.log(listado);
      io.sockets.emit('listado', listado);
  })
});
