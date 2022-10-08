import express from 'express';
const router = express.Router();
import { randomData } from "../database/faker.js";
import fs from 'fs';
/* import { userName, userStatus } from '../cookies_sessions/sessions.js'; */
let userName="admin"
let userStatus=false

/* PRODUCTOS ----------------------------------------------------------------------------------------- */
router.get('/productos', async (req, res) => {
    /* let listado = await productMongo.getAll(); */
    let listado = JSON.parse(fs.readFileSync('./database/data/productos.txt', 'utf-8'));
    if (listado.length>0) {
        res.render('../views/main.hbs', { prods: listado, productsExists: true, user: userName, userStatus: userStatus})
    } else {
        res.render('../views/main.hbs', { prods: listado, productsExists: false, user: userName , userStatus: userStatus})
    }
})

/* FAKER ----------------------------------------------------------------------------------------- */
router.get('/productos-test', (req, res) => {
    res.render('../views/main.hbs', { prods: randomData, productsExists: true, user: userName , userStatus: userStatus})
})

/* LOGIN ----------------------------------------------------------------------------------------- */
router.get('/login', (req, res) => {
    res.render('../views/partials/loginForm.hbs', { prods: randomData, productsExists: false, user: userName , userStatus: false})

})

function auth(req, res, next){
    if (req.session?.name !== "") {
        return next();
    }
    return res.status(401).send("Error de logueo.")
}

router.post('/login', auth, (req, res) => {
    let email = req.body.userEmail;
    let pass=req.body.inputPassword;
    /* Validaciones con info de base de datos*/
    req.session.name = email;
    /* res.redirect('/productos', {userName: email, userStatus: true}); */
    res.render('../views/main.hbs', { user: email , userStatus: true})
})

/* SIGN UP ----------------------------------------------------------------------------------------- */
router.get('/signup', (req, res) => {
    res.render('../views/partials/signUpForm.hbs', { prods: randomData, productsExists: false, user: userName , userStatus: false})

})

/* LOG OUT  ----------------------------------------------------------------------------------------- */
router.get('/logout', (req, res) => {
    try {
        console.log("Hasta luego " + req.session.name);
        req.session.destroy();
        res.render('../views/main.hbs', { userStatus: false})
    } catch (error) {
		res.send('Error: ', error);
	}
    
});

export default router;