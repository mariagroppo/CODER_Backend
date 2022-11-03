// Importación ------------------------------------------------------------------------------------------------------
import express from 'express';
import { Server } from 'socket.io';
import passport from 'passport';
import flash from 'connect-flash';
import {prodsMongo, msgsMongo} from "./routes/recursos.js";
import { } from 'dotenv/config';

/* MONGO DATABASE --------------------------------------------------------------------------------------------  */
import { connection } from "./database/mongoDB/config.js";
connection();

/* ROUTES --------------------------------------------------------------------------------------------  */
import router from './routes/recursos.js';
export const app = express();

/* SESSION --------------------------------------------------------------------------------------- */
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
/* La constante advancedOptions se utiliza para las opciones avanzadas de la conexión a la BD */
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true};
import dotenv from "dotenv";
dotenv.config();
const URL = process.env.URL_MONGO;

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: URL,
        mongoOptions: advancedOptions,
        ttl: 60,
        collectionName: 'sessions'
    }),
    secret: 'secret',
    /* Resave true es para que se guarde cada cierto tiempo */
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 100000 }
}));

app.use(express.static('./public'));
/* middleware: method inbuilt in express to recognize the incoming Request Object as a JSON Object. */
app.use(express.json());
/* middleware: method inbuilt in express to recognize the incoming Request Object as strings or arrays. */
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
/* app.use(flash()); */

/* app.use( (req, res, next) => {
    app.locals.signUpMessage = req.flash('signUpMessage');
    app.locals.signUpMessage = req.flash('loginPassMessage');
    app.locals.signUpMessage = req.flash('loginUserMessage');
    next();
}); */

app.use('/api', router);

/* LOGGERS----------------------------------------------------------------------------------- */
import log4js from "./loggers/logger.js";
export const loggerConsole = log4js.getLogger(`default`);
export const loggerArchiveWarn = log4js.getLogger(`warnArchive`);

/* Ruta y método de todas las peticiones recibidas por el servidor - info */
app.use((req, res, next) => {
    loggerConsole.info(`
    Ruta consultada: ${req.originalUrl}
    Metodo ${req.method}`);
    next();
});

/* Ruta y método de todas las peticiones a rutas inexistentes en el servidor - warn */
app.use((req, res, next) => {
    loggerConsole.warn(`
    Estado: 404
    Ruta consultada: ${req.originalUrl}
    Metodo ${req.method}`);

    loggerArchiveWarn.warn(`Estado: 404, Ruta consultada: ${req.originalUrl}, Metodo ${req.method}`);
    res.status(404).json({ error: -2, descripcion: `ruta ${req.originalUrl} metodo ${req.method} no implementada` });
    next();
});

/* SERVIDOR ------------------------------------------------------------------------------------ */
/* const puerto = process.env.PORT || 8080; */
import parseArgs from "minimist";
const args = parseArgs(process.argv.slice(2));

//node test.js --> ejecuta en puerto 8080
//node test.js -p xxxx --> ejecuta en puerto xxxx
const puerto = args.p || 8080;
export const server = app.listen(puerto, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`);
  });
  
server.on("error", (error) => logger.error(`Error en servidor: ${error}`));
/* server.on("error", (error) => console.log(`Error en servidor: ${error}`)); */
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

//--------------------------------------------
// NORMALIZACIÓN DE MENSAJES

import { normalize, schema, } from 'normalizr'
const schemaAuthor = new schema.Entity('authors', {}, { idAttribute: 'clientMail' });
const schemaMensaje = new schema.Entity('mensajes', { author: schemaAuthor }, { idAttribute: '_id' })

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

