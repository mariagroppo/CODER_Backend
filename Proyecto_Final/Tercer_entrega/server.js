import express from 'express';
export const app = express();
import passport from 'passport';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* SESSION --------------------------------------------------------------------------------------- */
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true};

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://mariagroppo:ctNZIOUDTyQzX680@cluster0.dud6uob.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptions,
        ttl: 60,
        collectionName: 'sessions'
    }),
    secret: 'secret',
    /* Resave true es para que se guarde cada cierto tiempo */
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000000 }
}));

/* ROUTERS ----------------------------------------------------------------------------------- */
app.use(passport.initialize());
app.use(passport.session());
/* import routerInicial from './src/routes/inicial.js'; */
import router from './src/routes/products.js';
import routerCart from './src/routes/cart.js';
import routerAuth from "./src/routes/routerAuth.js";
/* app.use('/api', routerInicial); */
app.use('/api/productos', router);
app.use('/api/cart', routerCart);
app.use('/api/auth', routerAuth);
app.use(express.static("src/public"));


/* ----------------- LOGGERS --------------------------------------------------------------------- */
import log4js from "./src/loggers/loggers.js";
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

/* SERVIDOR ------------------------------------------------------------------------------------  */
const puerto = process.env.PORT || 8080;
const server = app.listen(puerto, () => {console.log(`servidor escuchando en http://localhost:${puerto}`);});
server.on('error', error => {console.log('error en el servidor:', error);});
export default server;

/* CLUSTER --------------------------------------------------------------------------------------------  */
import parseArgs from "minimist";
const args = parseArgs(process.argv.slice(2));
import os from "os";
const numCPUs = os.cpus().length;
import cluster from "cluster";
const CLUSTER = args.CLUSTER;

if (CLUSTER) {
    if (cluster.isPrimary) {
        console.log(`CLUSTER - Nodo primario ${process.pid} corriendo.`);
        /* Creo un worker para cada CPU */
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
            console.log("valor de i: " + i)
        }
        /* Controlo la salida de los workers */
        cluster.on(`exit`, worker => {
            console.log(`Worker ${worker.process.pid} finalizado.`);
            cluster.fork();
        });
    } else {
        console.log(`Nodo Worker corriendo en el proceso ${process.pid}`);
    }
} else {
    console.log("No es cluster")
}



/* CONEXION CON MONGODB ----------------------------------------------------------------------- */
import { connection } from "./src/dbMongo/config.js";
connection();

/* CONFIGURACION DE HANDLEBARS ----------------------------------------------------------- */
import { engine } from 'express-handlebars';
app.engine('hbs', engine( {
    extname: '.hbs', // Extensión a utilizar
    defaultLayout: 'index.hbs', // Plantilla principal
    layoutsDir: 'src/views/layouts', // Ruta de la plantilla principal
    partialsDir: 'src/views/partials' // Ruta de las plantillas parciales
} ));
app.set('view engine', 'hbs');