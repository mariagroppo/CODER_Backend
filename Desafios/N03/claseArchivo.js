/* Copia del desafio N01 */
const fs = require ('fs');

/* Declaración de clase Archivo */
class Archivo {
    /* Atributos */
    constructor (archivo) {
        this.archivo = archivo;
    }
    
    /* Recibe un objeto, lo guarda en el archivo, devuelve el id asignado. ------------------------- */
    save = async (objeto) => {
        /* Averiguo cual es el próximo id */
        const arrayListado = await this.getAll();
        let maxId=0;
        arrayListado.forEach(valor => {
            if (valor.id > maxId) {
                maxId=valor.id
            }
        })
        maxId++;
        
        /* Guardo el objeto con el maxId */
        const obj = ({id:maxId, title:objeto.title, price:objeto.price, ruta:objeto.ruta});
        arrayListado.push(obj);
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(arrayListado, null,2));
            console.log('El id asignado al objeto "' + obj.title + '" es ', obj.id);
            console.log({arrayListado});
        } catch  {
            console.log('No se pudo guardar.')
        }
    }
    

    /* Recibe un id y devuelve el objeto con ese id o null si no está ------------------------------*/
    getById = async function objetInfo(number) {
        const arrayListado = await this.getAll();
        let objetoAMostrar=arrayListado.find(valor => valor.id===number);
        
        if (objetoAMostrar) {
            try {
                await fs.promises.writeFile(this.archivo, JSON.stringify(arrayListado, null,2));
                console.log({objetoAMostrar})
            } catch  {
                console.log('Error al intentar mostrar el objeto.')
            }
            
        } else {
            console.log('Id no disponible.')
            return null;    
        }
    }
    
    /* Devuelve el array con los objetos presentes en el archivo */
    getAll = async function readFile() {
        try {
            const contenido = await fs.promises.readFile(this.archivo, 'utf-8');
            return JSON.parse(contenido);
            
        } catch (error) {
            console.log('Error de lectura!', error);
        }
    } 
    
    /* Elimina del archivo el objeto con el id buscado */
    deleteById = async function cleanId(number) {
        const arrayListado = await this.getAll();
        if (number < arrayListado.length+1) {
            try {
                for (let i = 0; i < arrayListado.length; i++) {
                    if (arrayListado[i].id === number) {
                        arrayListado.splice(i,1)
                    } 
                }
                await fs.promises.writeFile(this.archivo, JSON.stringify(arrayListado, null,2));
                console.log({arrayListado});
            } catch (error) {
                console.log('Error al intentar borrar el id ingresado');
            }
        } else {
            console.log('Id ingresado no existe.');
            return null;
        }
    }    
    
    /* Elimina todos los objetos presentes en el archivo */
    deleteAll = async function borrarTodo() {
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify([], null, 2));
            console.log({arrayListado});
        } catch (error) {
            console.log('Error al intentar borrar toda la información.');
        }
    }
}

module.exports=Archivo;