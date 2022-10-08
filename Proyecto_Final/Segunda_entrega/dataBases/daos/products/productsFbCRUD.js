import {  queryProducts } from "../../config/firebase.js";

class ProductFirebase {
    
    async getAll() {
        const docsProducts = await queryProducts.get();
        const allProducts = docsProducts.docs.map(doc => {
            return {
                idDoc: doc.id,
                ...doc.data()
            };
        });
        /* console.log(allProducts); */
        return allProducts;
    }

    async save(product) {
        try {
            let collectionSize = await this.getAll();
            let id = collectionSize.length+1;
            const newProduct = {
                id: id, title: product.title, description: product.description, code: product.code, thumbnail: product.thumbnail, price: product.price, stock: product.stock 
            }
            let doc = queryProducts.doc();
            await doc.create(newProduct);
            
            console.log("Producto creado");
        } catch (error) {
            console.log("Error al intentar guardar el producto. " + error);
        }
    }
    
    async deleteById(idProduct) {
        try {
            let allProds = await this.getAll();
            let toDelete = "";
            allProds.forEach(a => {
                if (parseInt(a.id) === parseInt(idProduct)) {
                    toDelete = a.idDoc;
                }
            })
            const docProduct = queryProducts.doc(`${toDelete}`);
            await docProduct.delete();
            console.log("Producto borrado");
        } catch (error) {
            console.log("Error al intentar borrar el producto.")    
        }
    }

    async getById(idProduct) {
        try {
            /* console.log(idProduct); */
            let allProds = await this.getAll();
            let product = [];
            allProds.forEach(a => {
                if (parseInt(a.id) === parseInt(idProduct)) {
                    product = a;
                }
            })
            
            return product;
            
        } catch (error) {
            console.log("Error al intentar mostrar el producto.")
        }
    }

    async updateById(prod) {
       
        try {
            /* Verifico que el producto existe ------------------------ */
            let number = prod.id;
            console.log(number);
            
            let allProds = await this.getAll();
            let product = [];
            allProds.forEach(a => {
                if (parseInt(a.id) === parseInt(number)) {
                    product = a;
                }
            })
            console.log(product);


            if (product === []) {
                res.status(400).send({ error: 'Producto no encontrado.'});
            } else {
                if (prod.newTitle !== "" ) {
                    product.title=prod.newTitle
                } 
                if (prod.newDescription !== "" ) {
                    product.description=prod.newDescription
                }
                if (prod.newCode != "" ) {
                    product.code=prod.newCode
                } 
                if (prod.newThumbnail != "" ) {
                    product.thumbnail=prod.newThumbnail
                }
                if (prod.newPrice != "" ) {
                    product.price=prod.newPrice
                }
                if (prod.newStock != "" ) {
                    product.price=prod.newStock
                }
                console.log("NEW OBJECT");
                console.log(product);
            }
            
            await queryProducts.doc(`${product.idDoc}`).update({
                id: product.id, 
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                description: product.description,
                code: product.code,
                stock: product.stock
            })
            
    
    
        } catch (error) {
            console.log("Error al intentar actualizar el producto.")
        }
    }
    
    
}
export default ProductFirebase;