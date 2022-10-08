import { CartModel } from "../../models/cartModel.js";
import { Product } from "../../models/productModel.js";

class CartMongoDB {
    
    getAllCarts = async () => {
        try {
            const contenido = await CartModel.find().lean();
            return contenido;
            
        } catch (error) {
            console.log('Error de lectura!', error);
        }
    }

    createCart = async (user) => {
        const quantity = await CartModel.countDocuments();
        const idCart = quantity + 1;
        console.log("CANTIDAD DE ELEMENTOS + 1: " + idCart);
        let products=[];
        const cart = {idCart, user, products};
        console.log(cart);
        const newCart = new CartModel(cart);
        try {
            /* console.log(newProd); */
            await newCart.save();
        } catch (error) {
            console.log(error);
        }
    } 

    deleteById = async (id, userName) => {
        let cartToBeDeleted = await CartModel.findOne({idCart: id});
        let exists=0;
        let userCart="";
        if (cartToBeDeleted !== []) {
            exists=1;
            userCart=cartToBeDeleted.user
        }
        
        if (exists===1) {
            if (userCart === userName || userName === "admin") {
                try {
                    return await CartModel.deleteOne({idCart: id})
                } catch (error) {
                    console.log('Error al intentar borrar el id ingresado');
                }
            } else {
                console.log("Solo el dueño puede borrar el carrito.");    
            }
            
        } else {
            console.log('Id de carrito ingresado no existe.');
            return null;
        }
    }

    listById = async (number, user) => {
        
        let cartToBeListed = await CartModel.findOne({idCart: number}).lean();
        let exists=0;
        let userCart="";
        if (cartToBeListed !== []) {
            exists=1;
            userCart=cartToBeListed.user
        }
        let prodsCart=false;
        
        if (exists===1) {
            if (userCart === user || user === "admin") {
                try {
                    if (cartToBeListed.products.length > 0) {
                        prodsCart=true;
                    }
                    console.log(cartToBeListed);
                    return {cartToBeListed, prodsCart, exists};
                } catch (error) {
                    console.log('Error al intentar buscar el id ingresado');
                }
            } else {
                console.log("Solo el dueño puede ver el ccontenido del carrito.")
            }
        } else {
            console.log('Id de carrito ingresado no existe.');
            return {cartToBeListed, prodsCart, exists};

        }
        
    } 

    includeProductById = async (idCart, id, user) => {
        const p = await Product.findOne({id: id});
        let cart = await CartModel.findOne({idCart: idCart});
        
        /* 1. verifica que que ID del carrito exista */
        let existsCart=0;
        if (cart !== []) {
            existsCart=1;
            console.log("El carrito existe.")
        }
        
        /* 2. Verifico que el carrito pertenece al usuario  */
        let exists=0;
                
        if (existsCart===1) {
            if (cart.user === user || user === "admin") {
                console.log("El usuario esta ok");
                /* 3. verifico que el id del producto exista */
                
                if (p !== []) {
                    exists=1;
                    console.log("El producto esta ok");
                } else {
                    console.log("No hay productos listados.");
                }
                                
                try {
                    if (exists===1) {
                        cart.products.push(p);
                        await CartModel.updateOne({idCart: idCart}, {products: cart.products })
                        console.log("Producto agregado");
                    } else {
                        console.log("El ID del producto ingresado no existe.");
                    }
    
                } catch (error) {
                    console.log('Error al intentar buscar el id ingresado');
                }
            } else {
                console.log("Solo el dueño puede ver el ccontenido del carrito.")
            }
        } else {
            console.log('Id de carrito ingresado no existe.');
            return null;
        }
    } 

}

export default CartMongoDB;