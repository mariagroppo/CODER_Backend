import fs from "fs";
import knex from "knex";

class ArchivoMensajes {
  constructor(path, db, table) {
    this.path = path;
    this.db = db;
    this.table = table;
  }


  /* Crea la tabla en BD si no esta ------------------------- */
  createTableDB () {
    this.db.schema.createTable(this.table, (table) => {
      table.increments('id');
      table.string("userMail").notNullable().defaultTo("DESCONOCIDO");
      table.string("mensaje");
      table.string("fecha");
    })
    .then(() => {
      console.log("Tabla creada");
    });
  }

  save = async (message) => {
    const arrayList = await this.getAll();
    if (arrayList.length === 0) {
      await this.createTableDB();
    }
    try {
        await this.db.insert(message).into(this.table);
        console.log("Mensaje guardado.");  
    } catch (error) {
        console.log('No se pudo guardar.')
    }
}

  getAll = async () => {
    try {
        const contenido = JSON.stringify(await this.db.select().from(this.table));
        return contenido
    } catch (error) {
        console.log('Error de lectura!', error);
        const emptyArray = "";
        return emptyArray;
    }
  } 


}

export default ArchivoMensajes;