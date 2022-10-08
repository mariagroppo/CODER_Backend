import express from 'express'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import ContenedorArchivo from './src/contenedores/ContenedorArchivo.js'

import config from './src/config.js'
import { engine } from 'express-handlebars';
//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

/* MONGO DATABASE --------------------------------------------------------------------------------------------  */
import { prodsMongo, msgsMongo } from './src/routes/routes.js';
import { connection } from "./src/config.js";
connection();

//--------------------------------------------
// NORMALIZACIÓN DE MENSAJES

import { normalize, schema, } from 'normalizr'
// Definimos un esquema de autor
export const schemaAuthor = new schema.Entity('authors', {}, { idAttribute: 'clientMail' });
// Definimos un esquema de mensaje
export const schemaMensaje = new schema.Entity('mensajes', { author: schemaAuthor }, { idAttribute: '_id' })

/* CONFIGURACION DE HANDLEBARS ------------------------------------------------------------------ */
app.set('view engine', 'hbs');
app.engine('hbs',engine( {
    extname: '.hbs', // Extensión a utilizar
    defaultLayout: 'index.hbs', // Plantilla principal
    layoutsDir: './views/layouts', // Ruta de la plantilla principal
    partialsDir: './views/partials' // Ruta de las plantillas parciales
} ));

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    socket.emit('productos', await prodsMongo.getAll());

    // actualizacion de productos
    socket.on('update', async producto => {
        await prodsMongo.save(producto);
        io.sockets.emit('productos', await prodsMongo.getAll());
    })

    // carga inicial de mensajes
    socket.emit('mensajes', await listarMensajesNormalizados());

    // actualizacion de mensajes
    socket.on('nuevoMensaje', async mensaje => {
        await msgsMongo.save(mensaje)
        /* console.log(await listarMensajesNormalizados()); */
        io.sockets.emit('mensajes', await listarMensajesNormalizados());
    })
});

async function listarMensajesNormalizados() {
    const normalizados = normalize(await msgsMongo.getAll(), [schemaMensaje]);
    return normalizados
}

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
import router from './src/routes/routes.js';
app.use('/api', router);

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
