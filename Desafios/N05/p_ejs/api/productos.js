class Productos {
    constructor() {
        this.productos = [];
    }

    saveProduct(title, price, ruta) {
        try {
            this.productos.push({
                id: this.productos.length + 1,
                title: title,
                price: price,
                ruta: ruta
            });
        } catch (error) {
            throw error;
        }
    }

    getProducts() {
        return this.productos;
    }

    listProduct(id) {
        const producto = this.productos.find(producto => producto.id == id);
        return producto;
    }

    deleteProduct(id) {
        let index = this.productos.findIndex(producto => producto.id == id);
        if (index === -1) {
            throw new Error('Producto no encontrado.')
        } else {
            this.productos.splice(index, 1);
        }

    }

}

module.exports = Productos;