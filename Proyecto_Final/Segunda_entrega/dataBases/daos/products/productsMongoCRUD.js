import { Product } from "../../models/productModel.js";

class ProductMongoDB {
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async () => {
        
        try {
            const contenido = await Product.find().lean()
            return contenido;
            
        } catch (error) {
            console.log('Error de lectura!', error);
        }
    } 

    save = async (newProduct) => {
        const quantity = await Product.countDocuments();
        const id = quantity + 1;
        console.log("CANTIDAD DE ELEMENTOS + 1: " + id);
        const title=newProduct.title;
        const description=newProduct.description;
        const code=newProduct.code;
        const thumbnail=newProduct.thumbnail;
        const price=newProduct.price;
        const stock=newProduct.stock;
        const prod = {id, title, description, code, thumbnail, price, stock};
        
        /* console.log(prod) ; */
        const newProd = new Product(prod);
        try {
            /* console.log(newProd); */
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
        
        const newObject = await Product.findOne({id: number});
        
        if (newObject === []) {
            res.status(400).send({ error: 'Producto no encontrado.'});
        } else {
            if (prod.newTitle !== "" ) {
                newObject.title=prod.newTitle
            } 
            if (prod.newDescription !== "" ) {
                newObject.description=prod.newDescription
            }
            if (prod.newCode != "" ) {
                newObject.code=prod.newCode
            } 
            if (prod.newThumbnail != "" ) {
                newObject.thumbnail=prod.newThumbnail
            }
            if (prod.newPrice != "" ) {
                newObject.price=prod.newPrice
            }
            if (prod.newStock != "" ) {
                newObject.price=prod.newStock
            }
            console.log("NEW OBJECT");
            console.log(newObject);
        }
        
        await Product.updateOne({id: number}, newObject)
        
    
    }

}

export default ProductMongoDB;