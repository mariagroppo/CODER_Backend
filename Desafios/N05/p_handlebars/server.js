const express = require('express');
const app = express();
const { engine } = require('express-handlebars');

// Motor de la plantilla que se utiliza
app.set('view engine', 'hbs');
// Directorio donde se encuentran los archivos de plantilla
/* app.set("views", "./views"); */

// Configuración de handlebars
app.engine('hbs',engine( {
    extname: '.hbs', // Extensión a utilizar
    defaultLayout: 'index.hbs', // Plantilla principal
    layoutsDir: __dirname + '/views/layouts', // Ruta de la plantilla principal
    partialsDir: __dirname + '/views/partials' // Ruta de las plantillas parciales
} ));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = require('./recursos/recursos.js');
app.use('/api/productos', router);

const puerto = 8080;
const server = app.listen(puerto, () => {console.log(`servidor escuchando en http://localhost:${puerto}`);});
server.on('error', error => {console.log('error en el servidor:', error);});
module.exports = server;
