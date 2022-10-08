const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const router = require('./recursos/recursos.js');
app.use('/api/productos', router);
const puerto = 8080;

const server = app.listen(puerto, () => {console.log(`servidor escuchando en http://localhost:${puerto}`);});

server.on('error', error => {console.log('error en el servidor:', error);});

module.exports = server;