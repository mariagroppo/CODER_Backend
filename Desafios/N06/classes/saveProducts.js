/* Copia del desafio N01 */
const fs = require ('fs');

/* Declaración de clase Archivo */
class ProductsFile {
    /* Atributos */
    constructor (archivo) {
        this.archivo = archivo;
    }
    
    /* Actualiza el archivo txt con los productos disponibles. ------------------------- */
    save = async (objeto) => {
        try {
            const arrayList = await this.getAll();
            let id=arrayList.length+1;
            /* console.log("Se asigna ID")
            console.log(id); */
            const obj = ({id:id, title:objeto.title, price:objeto.price, ruta:objeto.ruta});
            /* console.log(obj); */
            arrayList.push(obj);
            await fs.promises.writeFile(this.archivo, JSON.stringify([], null, 2));
            await fs.promises.writeFile(this.archivo, JSON.stringify(arrayList, null, 2));
        } catch (error) {
            console.log('No se pudo guardar.')
        }
    }
    
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async () => {
        try {
            const contenido = await fs.promises.readFile(this.archivo, 'utf-8');
            return JSON.parse(contenido);
            
        } catch (error) {
            console.log('Error de lectura!', error);
        }
    } 
}

module.exports=ProductsFile;