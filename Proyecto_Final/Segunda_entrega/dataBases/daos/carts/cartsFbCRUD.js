import {  queryCarts, FieldValue } from "../../config/firebase.js";
import  { productFB } from "../../../routes/products.js";

class CartFirebase {
    
    async getAll() {
        const docsCarts = await queryCarts.get();
        const allCarts = docsCarts.docs.map(doc => {
            return {
                idDoc: doc.id,
                ...doc.data()
            };
        });
        /* console.log(allCarts); */
        return allCarts;
    }

    async createCart(userName) {
        
        
        try {
            let collectionSize = await this.getAll();
            let idCart = collectionSize.length+1;
            let products=[];
            const cart = {idCart: idCart, user: userName, products: products};

            let doc = queryCarts.doc();
            await doc.create(cart);
            console.log("Carrito creado");
                
        } catch (error) {
            console.log("Error al intentar guardar el carrito. " + error);
        }
    }
    
    async deleteById(idToDelete, userName) {
        try {
            let toDelete = "";
            let u="";
            const toShow = await this.getById(idToDelete);
            if (toShow!==[]) {
                toDelete=toShow.idDoc;
                u=toShow.user;
            }

            if (u === userName || u === "admin" ) {
                const docCart = queryCarts.doc(`${toDelete}`);
                await docCart.delete();
                console.log("Carrito borrado");
                
            } else {
                console.log("El carrito no le corresponde.")
            }
        } catch (error) {
            console.log("Error al intentar borrar el producto.")    
        }
    }

    async getById(idCart) {
        try {
            /* console.log(idProduct); */
            let allCarts = await this.getAll();
            let toShow = [];
            allCarts.forEach(a => {
                if (parseInt(a.idCart) === parseInt(idCart)) {
                    toShow = a;
                }
            })
            
            return toShow;
            
        } catch (error) {
            console.log("Error al intentar mostrar el producto.")
        }
    }

    listById = async (number, user) => {
        let resp = {
            obj: [],
            products: [],
            exists: false
        };
        let cartToBeListed = [];
        try {
            cartToBeListed = await this.getById(number);
            console.log(cartToBeListed);

            if (cartToBeListed !== []) {
                if (cartToBeListed.user === user || user === "admin") {
                    let prodsCart=cartToBeListed.products;
                    let exists=true;
                    return resp = {cartToBeListed, prodsCart, exists};
                    
                } else {
                    console.log("Solo el dueño puede ver el ccontenido del carrito.")
                }
            } else {
                console.log("Carrito no encontrado.")
            }
        } catch (error) {
            console.log(error);
        }
    } 
    
    
    includeProductById = async (idCart, id, user) => {
        let prods=[];
        try {
            /* 1. verifica que que ID del carrito exista */
            const toShow = await this.getById(idCart);
            if (toShow!==[]) {
                /* 2. Verifico que el carrito pertenece al usuario  */
                if (toShow.user === user || user === "admin") {
                    /* 3. verifico que el id del producto exista */
                    let product = await productFB.getById(id);
                    if (product !== []) {
                        /* 4. Verifico usuario */
                        if (user === toShow.user || user === "admin") {
                            await queryCarts.doc(`${toShow.idDoc}`).update({
                                idCart: toShow.idCart, 
                                user: toShow.user,
                                products: FieldValue.arrayUnion(product),
                            })
                            console.log("Producto agregado.")
                            
                        } else {
                            console.log("El usuario del carrito no corresponde.")
                        }

                    } else {
                        console.log("Producto no encontrado.")
                    }
                } else {
                    console.log("El carrito pertenece a otro usuario.")
                }
            } else {
                console.log("El carrito elegido no existe.")
            }
        } catch (error) {
            console.log(error);
        }
        
        
    } 
}
export default CartFirebase;