/* Copia del desafio N01 */
import fs from 'fs';
import { idMaxCalculation } from "../../functions/indexProduct.js";

/* Declaración de clase Archivo */
class ProductsFile {
    /* Atributos */
    constructor (archivo) {
        this.archivo = archivo;
    }
    
    /* Actualiza el archivo txt con los productos disponibles. ------------------------- */
    save = async (objeto) => {
        const newId = idMaxCalculation();
        console.log(newId);
        const timestamp = Date.now();
        const arrayList = await this.getAll();
        /* Agrego el nuevo producto al listado de productos */
        try {
            const obj = ({
                id:newId,
                timestamp: timestamp,
                title: objeto.title,
                description: objeto.description,
                code: objeto.code,
                thumbnail: objeto.thumbnail,
                price: objeto.price,
                stock: objeto.stock});
            console.log(obj);
            await arrayList.push(obj);
            console.log(arrayList);
            await fs.promises.writeFile(this.archivo, JSON.stringify([], null, 2));
            await fs.promises.writeFile(this.archivo, JSON.stringify(arrayList, null, 2));
        } catch (error) {
            console.log('No se pudo guardar.' + error)
        }
    }
    
    /* Actualiza producto por id ------------------------------*/
    updateProducts = async (prod) => {
        let number=prod.id;
        const arrayList = await this.getAll();
        let index = arrayList.findIndex(producto => producto.id == number);

        if (index === -1) {
            res.status(400).send({ error: 'Producto no encontrado.'});
        } else {
            if (prod.newTitle !== "" ) {
                arrayList[index].title=prod.newTitle
            } 
            if (prod.newDescription !== "" ) {
                arrayList[index].description=prod.newDescription
            }
            if (prod.newCode != "" ) {
                arrayList[index].code=prod.newCode
            } 
            if (prod.newThumbnail != "" ) {
                arrayList[index].ruta=prod.newThumbnail
            }
            if (prod.newPrice != "" ) {
                arrayList[index].price=prod.newPrice
            }
            if (prod.newStock != "" ) {
                arrayList[index].price=prod.newStock
            }
        }
        console.log(arrayList[index]);
        
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify([], null,2));
            await fs.promises.writeFile(this.archivo, JSON.stringify(arrayList, null,2));
        } catch (error) {
            console.log('Error de lectura!', error);
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
    
    /* Elimina del archivo el objeto con el id buscado */
    deleteById = async (number) => {
        const arrayList = await this.getAll();
        let exists=0;
        for (let index = 0; index < arrayList.length; index++) {
            if (parseInt(number) === parseInt(arrayList[index].id)) {
                exists=1;
            }
        }
        if (exists===1) {
            try {
                let newArray = arrayList.filter(product => product.id != number);
                await fs.promises.writeFile(this.archivo, JSON.stringify([], null,2));
                await fs.promises.writeFile(this.archivo, JSON.stringify(newArray, null,2));
            } catch (error) {
                console.log('Error al intentar borrar el id ingresado');
            }
        } else {
            console.log('Id ingresado no existe.');
            return null;
        }
    }    
    
    /* Busvc del archivo el objeto con el id indicado */
    getById = (number) => {
        const arrayList = JSON.parse(fs.readFileSync('../Segunda_entrega/dataBases/data/listProducts.txt', 'utf-8'));
        let exists=0;
        let locate=0;
        for (let index = 0; index < arrayList.length; index++) {
            if (parseInt(number) === parseInt(arrayList[index].id)) {
                exists=1;
                locate=index;
            }
        }
        if (exists===1) {
            try {
                const obj = arrayList[locate];
                return obj;
            } catch (error) {
                console.log('Error al intentar buscar el id ingresado');
            }
        } else {
            console.log('Id ingresado no existe.');
            return null;
        }
    } 
}

export default ProductsFile;