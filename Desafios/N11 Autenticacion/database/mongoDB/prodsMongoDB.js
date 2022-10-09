import { Product } from "./models/productModel.js";

class ProductMongoDB {
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async () => {
        try {
            const contenido = await Product.find().lean()
            let contenido2=contenido;
            for (let i = 0; i < contenido.length; i++) {
                contenido2[i]._id = contenido[i]._id.toString();
            }
            return contenido2;
            
        } catch (error) {
            console.log('Error de lectura!', error);
            let cont=[];
            return cont;
        }
    } 

    save = async (newProduct) => {
        const quantity = await Product.countDocuments();
        const id = quantity + 1;
        /* En realidad deberia devolver un valor mas del ultimo id asignado */
        const title=newProduct.title;
        const thumbnail=newProduct.thumbnail;
        const price=newProduct.price;
        const prod = {id, title, thumbnail, price};
        const newProd = new Product(prod);
        /* console.log(newProd) */
        try {
            await newProd.save();
        } catch (error) {
            console.log(error);
        }
    } 

    deleteById = async (id) => {
        try {
            return await Product.deleteOne({
                id: id
            })
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    getById = async (number) => {
        try {
            return await Product.findOne({
                id: number
            }).lean();
        } catch (error) {
            console.log('Error al intentar buscar el id ingresado');
        }
        
    } 

    updateById = async (prod) => {
        let number=prod.id;
        let newObject = await Product.findOne({id: number});
        console.log("nre objetc");
        console.log(newObject)
        if (newObject === []) {
            res.status(400).send({ error: 'Producto no encontrado.'});
        } else {
            if (prod.title !== "" ) {
                newObject.title=prod.title
            } 
            if (prod.ruta != "" ) {
                newObject.ruta=prod.ruta
            }
            if (prod.price != "" ) {
                newObject.price=prod.price
            }
            console.log("NEW OBJECT");
            console.log(newObject);
        }
        
        await Product.updateOne({id: number}, newObject)
        
    
    }

}

export default ProductMongoDB;