const fs = require("fs");

class ArchivoMensajes {
  constructor(path) {
    this.path = path;
  }

  save = async (message) => {
    const arrayListado = await this.getAll();
    console.log({arrayListado});
    const obj = ({userMail:message.userMail, mensaje:message.mensaje, fecha:message.fecha});
    console.log({obj});
    arrayListado.push(obj);
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(arrayListado, null, 2));
    } catch (error) {
        console.log('No se pudo guardar.')
    }
  }

  getAll = async function readFile() {
    try {
        const contenido = await fs.promises.readFile(this.path, 'utf-8');
        console.log({contenido});
        return JSON.parse(contenido);
    } catch (error) {
        console.log( "Error al obtener los mensajes");
    }
  }

}

module.exports = ArchivoMensajes;