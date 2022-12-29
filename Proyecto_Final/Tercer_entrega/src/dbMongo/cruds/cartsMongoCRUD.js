import { CartModel } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

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
        const contenido = await this.getAllCarts();
        let max=0;
        for (let index = 0; index < contenido.length; index++) {
            console.log(contenido[index].idCart)
            if (contenido[index].idCart > max) {
                max=contenido[index].idCart
                console.log("MAX: " + max)
            }
        }
        const idCart = max + 1;
        let products=[];
        let cartStatus=true;
        const cart = {idCart, user, products, cartStatus};
        console.log(cart);
        const newCart = new CartModel(cart);
        try {
            /* console.log(newProd); */
            await newCart.save();
            console.log(`El carrito ${idCart} fue creado`);
        } catch (error) {
            console.log("Error createCart Mongo: " + error);
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
                    await CartModel.deleteOne({idCart: id});
                    console.log(`El carrito ${id} fue borrado`);
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
                    /* console.log(cartToBeListed); */
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
                    let productInCart=false;
                    let indexProduct=0;
                    for (let index = 0; index < cart.products.length; index++) {
                        if (cart.products[index].id === p.id) {
                            productInCart = true;
                            indexProduct=index;
                            console.log("El producto se encuentra en el carrito")
                        }
                    }
                    if (productInCart === true) {
                        cart.products[indexProduct].quantity=cart.products[indexProduct].quantity+1;
                        /* console.log(cart.products[indexProduct].quantity) */
                        await CartModel.updateOne({idCart: idCart}, {products: cart.products });
                    } else {
                        const newProduct = {
                            id :p.id,
                            title: p.title,
                            description: p.description,
                            code: p.code,
                            thumbnail: p.thumbnail,
                            price: p.price,
                            stock: p.stock,
                            quantity: 1
                        }
                        
                        cart.products.push(newProduct); 
                        await CartModel.updateOne({idCart: idCart}, {products: cart.products })
                        console.log("Producto agregado");
                    }

                } else {
                    console.log("No hay productos listados.");
                }
            } else {
                console.log("Solo el dueño puede ver el contenido del carrito.")
            }
        } else {
            console.log('Id de carrito ingresado no existe.');
            return null;
        }
    } 

    closeCart = async (number, user) => {
        
        try {
            let cartToBeClosed = await CartModel.findOne({idCart: number}).lean();
            let exists=0;
            let userCart="";
            if (cartToBeClosed !== []) {
                exists=1;
                userCart=cartToBeClosed.user
            }
            if (exists===1) {
                if (userCart === user || user === "admin") {
                    cartToBeClosed.cartStatus = false;
                    await CartModel.updateOne({id: number}, cartToBeClosed)
                    console.log("Carrito cerrado")
                } else {
                    console.log("Solo el dueño puede comprar y cerrar el carrito.")
                }
            } else {
                console.log('Id de carrito ingresado no existe.');
            }
        } catch (error) {
            console.log("error en closeCart: " + error)
        }
}

    /* stockUpdate = async (productos) => {
    
    } */

}

export default CartMongoDB;