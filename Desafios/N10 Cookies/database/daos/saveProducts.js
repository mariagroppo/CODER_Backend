/* Copia del desafio N01 */
import fs from 'fs';

/* Declaración de clase Archivo */
class ProductsFile {
    /* Atributos */
    constructor (archivo, db, table) {
        this.archivo = archivo;
        this.db = db;
        this.table = table;
    }
    
    /* Crea la tabla en BD si no esta ------------------------- */
    createTableDB () {
        this.db.schema.hasTable(this.table).then((exists) => {
            if (!exists) {
                  this.db.schema.createTable(this.table, (table) => {
                    table.increments('id');
                    table.string("title").notNullable().defaultTo("SIN TITULO");
                    table.string("ruta");
                    table.float("price").notNullable().defaultTo(0);
                    
                  })
                  .then(() => {
                    console.log("Tabla creada");
                  });
            } else {
                console.log("La tabla ya se encuentra en la BD.");
            }
          });
    }

    /* Actualiza el archivo txt y la BD con los productos disponibles. ------------------------- */
    save = async (newProduct) => {
        await this.createTableDB();
        try {
            await this.db.insert(newProduct).into(this.table);
        } catch (error) {
            console.log('No se pudo guardar.')
        } finally {
            const arrayList = await this.getAll();
            await fs.promises.writeFile(this.archivo, JSON.stringify([], null, 2));
            await fs.promises.writeFile(this.archivo, JSON.stringify(arrayList, null, 2));
            console.log("Producto guardado.");           
        }
    }
    
    /* Devuelve el array con los objetos presentes en la BD ---------------------------------------- */
    getAll = async () => {
        try {
            const contenido = JSON.stringify(await this.db.select().from(this.table))
            return JSON.parse(contenido)
        } catch (error) {
            console.log('Error de lectura!', error);
        }
    } 

    getById = async (id) => {
        try {
            const product = JSON.parse(JSON.stringify(await this.db.select().from(this.table).where({ id }).first()));
            if (product) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

      
    deleteById = async (id) => {
        try {
            const exist = await this.getById(id);
            if (!exist) {
                console.log('Id ingresado no existe.');
            } else {
                await this.db.from(this.table).where({ id }).delete();
                console.log("Producto eliminado");
            }
        } catch (error) {
            console.log('Error al intentar borrar el id ingresado' + error);
        }
        finally {
            const arrayList = await this.getAll();
            await fs.promises.writeFile(this.archivo, JSON.stringify([], null, 2));
            await fs.promises.writeFile(this.archivo, JSON.stringify(arrayList, null, 2));
        }
    }

    updateProduct = async (productUpdated) => {
        let id = productUpdated.id;
        try {
            const exist = await this.getById(productUpdated.id);
            if (!exist) {
                console.log('Id ingresado no existe.');
            } else {
                const oldProduct=JSON.parse(JSON.stringify(await this.db.select().from(this.table).where({ id }).first()));
                let oldTitle=oldProduct.title;
                let oldPrice=oldProduct.price;
                let oldRuta=oldProduct.ruta;
                if (productUpdated.title !== oldTitle && productUpdated.title != "") {
                    console.log("Se actualiza titulo");
                    oldProduct.title=productUpdated.title
                }
                if (productUpdated.price !== oldPrice && productUpdated.price !== "") {
                    console.log("Se actualiza precio");
                    oldProduct.price=productUpdated.price
                }
                if (productUpdated.ruta !== oldRuta && productUpdated.ruta !== "") {
                    console.log("Se actualiza ruta.");
                    oldProduct.ruta=productUpdated.ruta
                }
                await this.db.where({ id }).update(oldProduct).into(this.table);
            }
        } catch (error) {
            console.log('Error al intentar actualizar el producto seleccionado.' + error);
        }
        finally {
            const arrayList = await this.getAll();
            await fs.promises.writeFile(this.archivo, JSON.stringify([], null, 2));
            await fs.promises.writeFile(this.archivo, JSON.stringify(arrayList, null, 2));
        }
    }

    /* filterById = async (id) => {
        let filProduct=[];
        const exist = await this.getById(id);
        if (!exist) {
            console.log('Id ingresado no existe.');
            return filProduct;
        } else {
            try {
                filProduct = JSON.parse(JSON.stringify(await this.db.select().from(this.table).where({ id }).first()));
            } catch (error) {
                console.log('Error al intentar filtrar el id ingresado' + error);
            }
            finally {
                console.log(filProduct);
                return filProduct; 
            }
            
        }
        
        
    } */

}

export default ProductsFile;