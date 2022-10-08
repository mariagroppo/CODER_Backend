// Importación ------------------------------------------------------------------------------------------------------
import express from 'express';
import { Server } from 'socket.io';
import { databaseMySql, dbSqlite3 } from "./database/database.js";
import normalizar from "./database/mongoDB/normalize.js";

/* CLASSES ------------------------------------------------------------------------------------------------- */
import ArchivoMensajes from './database/daos/saveMessage.js';
let listadoMensajes = new ArchivoMensajes('./data/mensajes.txt', dbSqlite3, 'messages');

import ArchivoProductos from './database/daos/saveProducts.js';
export let listadoProductos = new ArchivoProductos('./data/productos.txt', databaseMySql, 'productsTable');

/* MONGO DATABASE --------------------------------------------------------------------------------------------  */
import { connection } from "./database/mongoDB/config.js";
connection();

import MessageMongoDB from "./database/mongoDB/msgMongoDB.js";
const msgMongo = new MessageMongoDB();

import router from './routes/recursos.js';
export const app = express();

/* SESSION --------------------------------------------------------------------------------------- */
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
/* La constante advancedOptions se utiliza para las opciones avanzadas de la conexión a la BD */
/* const advancedOptions = { userNewUrlParser: true, useUnifiedTopology: true}; */

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/desafio10',
        /* mongoOptions: advancedOptions, */
        ttl: 60,
        collectionName: 'sessions'
    }),
    secret: 'secret',
    /* Resave true es para que se guarde cada cierto tiempo */
    resave: false,
    saveUninitialized: false,
    /* ttl: 30, */
    cookie: { maxAge: 60000 }
}));

// ------------------------------------------------------------------------------------------------------------

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);


/* SERVIDOR ------------------------------------------------------------------------------------ */
const puerto = process.env.PORT || 8080;

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
let messages = await msgMongo.getAll(); 

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');
    
    /* socket.emit('listado', listado); */
    socket.emit('currentChat', messages);

    socket.on('saveMessage', async (message) => {
        msgMongo.save(message);
        listadoMensajes.save(message);
        messages.push(message);
        let mess= await msgMongo.getAll();
        /* console.log("MESS ---------------------------------------------------------------------------------------")
        console.log(mess); */
        let mess2 = await normalizar(mess);
        console.log("MESS2 ---------------------------------------------------------------------------------------")
        console.log(mess2);
        io.sockets.emit('currentChat', mess2);
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

    
});
