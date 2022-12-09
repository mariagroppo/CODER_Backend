import ProductMongoDB from "../dbMongo/cruds/productsMongoCRUD.js";
export const productMongo = new ProductMongoDB();

/* GET Vista de todos los productos -------------------------------- */
export const getAllProducts = async (req, res) => {
    try {
        let listado= await productMongo.getAll();
        let userState = req.isAuthenticated();
        let userName = req.user.userName;
        let avatar = req.user.avatar;
        let adminLicence = false;
        if (userName === "admin") {
            adminLicence = true;
        }
        if (listado.length>0) {
            res.render('../src/views/main.hbs', { prods: listado, productsExists: true, user: userName, userStatus: userState, adminLicence: adminLicence, avatar: avatar})
        } else {
            res.render('../src/views/main.hbs', { prods: listado, productsExists: false, user: userName , userStatus: userState, adminLicence: adminLicence, avatar: avatar})
        }
    } catch (error) {
        return res.status(404).json({
            error: `Error al obtener todos los productos${error}`
        });
    }
    
}

/* GET Vista de formularios para administrador o dueño del producto --------------------- */
export const editProducts = async (req, res) => {
    try {
        let userName = req.user.userName;
        let userState = req.isAuthenticated();
        let avatar = req.user.avatar;
        let adminLicence =false;
        if (userName === "admin") {
            adminLicence =true;
        }
        res.render('../src/views/partials/formsAdmin.hbs', {user: userName, userStatus: userState, adminLicence: adminLicence, avatar:avatar})
    } catch (error) {
        console.log(error)
    }
}

export const deleteProductById = async (req, res) => {
    try {
        let id = req.body.id;
        let validateFields=true;
        if (id === "") {
           validateFields=false;
        }
    
        if (validateFields === true) {
            if (isNaN(id)){
                res.status(400).send({ error: 'El parámetro no es un número.'})    
            } else {
                productMongo.deleteById(id);
                res.redirect('/api/productos');
            }
        } else {
           console.log("El campo ID debe estar completo.")   
        }
    } catch (error) {
        console.log("Error en deleteProductById: " + error);
    }
}

export const addNewProduct = async (req, res) => {
    try {
        const {title, description, code, thumbnail, price, stock} = req.body;
        let validateFields=true;
        if (title === "") {
            validateFields=false;
        }
        if (description === "") {
            validateFields=false;
        }
        if (code === "") {
            validateFields=false;
        }
        if (thumbnail === "") {
            validateFields=false;
        }
        if (price === "") {
            validateFields=false;
        }
        if (stock === "") {
            validateFields=false;
        }
    
        if (validateFields === true) {
            const prod = {title, description, code, thumbnail, price, stock};
            productMongo.save(prod);
            res.redirect('/api/productos');    
        } else {
            console.log("Todos los campos deben estar completos.");    
        }
        req.body.reset;
    } catch (error) {
        console.log("Error en addNewProduct: " + error)    
    }
    
 }

 export const showProductById = async (req, res) => { // devuelve un producto segùn su id 
    try {
        let id = req.params.id;
        let prod=[];
        if (isNaN(id)){
            res.status(400).send({ error: 'El parámetro no es un número.'})    
        } else {
            prod = await productMongo.getById(id);
            res.render('../src/views/partials/lookForId.hbs', { prod: prod, productsExists: true, user:userName, userStatus: userState, adminLicence: adminLicence})
            
        }
    } catch (error) {
        console.log("Error en showProductById: " + error)    
    }
}

export const updateProductById = async (req, res) => {
    try {
        const {id, newTitle, newDescription, newCode, newThumbnail, newPrice, newStock} = req.body;
        let validateFields=true;
        if (id === "") {
            validateFields=false;
        }
    
        if (validateFields === true) {
            const prod = {id, newTitle, newDescription, newCode, newThumbnail, newPrice, newStock};
            /* console.log(prod); */
            productMongo.updateById(prod);
            res.redirect('/api/productos');
        } else {
            console.log("El campo ID debe estar completo.");
        }
    } catch (error) {
        console.log("Error en updateProductById: " + error)    
    }

}


export const updateProductByIdTable = async (req, res) => {
    try {
        let id = req.body.idEdit;
        let userName = req.user.userName;
        let userState = req.isAuthenticated();
        let avatar = req.user.avatar;
        let adminLicence =false;
        if (userName === "admin") {
            adminLicence =true;
        }
        
        res.render('../src/views/partials/updateProduct.hbs', {user: userName, userStatus: userState, adminLicence: adminLicence, avatar:avatar, id:id})
        
        
    } catch (error) {
        console.log("Error en update: " + error)
    }}

/* export const orderMinorPrice = async (req, res) => {
    try {
        let listado= await productMongo.getAll();
        if (listado.length>0) {
            for (let i = 0; i < listado.length; i++) {
                for (let j = 0; j < listado.length; j++) {
                    if (listado[j + 1].price < listado[j].price) {
                        temporal = listado[j + 1];
                        listado[j + 1] = listado[j];
                        listado[j] = temporal;
                    }
                    
                }
            }

            res.render('../src/views/main.hbs', { prods: listado, productsExists: true, user: userName, userStatus: userState, adminLicence: adminLicence, avatar: avatar})
        } else {
            res.render('../src/views/main.hbs', { prods: listado, productsExists: false, user: userName , userStatus: userState, adminLicence: adminLicence, avatar: avatar})
        }
    } catch (error) {
        return res.status(404).json({
            error: `Error al obtener todos los productos${error}`
        });
    }
    
}
 */