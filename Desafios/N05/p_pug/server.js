const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = require('./recursos/recursos.js');
app.use('/api/productos', router);

// Motor de la plantilla que se utiliza
app.set('view engine', 'pug');
// Directorio donde se encuentran los archivos de plantilla
app.set("views", "./views");

const puerto = 8080;
const server = app.listen(puerto, () => {console.log(`servidor escuchando en http://localhost:${puerto}`);});
server.on('error', error => {console.log('error en el servidor:', error);});
module.exports = server;