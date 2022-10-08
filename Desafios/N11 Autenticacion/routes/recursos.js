import express from 'express';
const router = express.Router();
import { randomData } from "../database/faker.js";
import fs from 'fs';
import passport from 'passport';
import "../passport/local-auth.js"

/* middlewares -----------------------------------------------------------------------------------------] */

/* revisa si esta autenticado */
function requireAuthentication (req, res, next) {
    console.log(req.session.passport.user)
    let a = req.isAuthenticated();
    console.log(a);
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect("/api/login")
    }
}

/* function roleAdmin(req, res, next) {
    console.log('>', req.user)
    if (req.isAuthenticated() && req.user.rol == 'admin') {
        next();
    } else {
        res.status(401).send('no autorizado')
    }
} */

/* PRODUCTOS ----------------------------------------------------------------------------------------- */
router.get('/productos', requireAuthentication, async (req, res) => {
    let userName = req.session.passport.user.userEmail;;
    /* let listado = await productMongo.getAll(); */
    let listado = JSON.parse(fs.readFileSync('./database/data/productos.txt', 'utf-8'));
    if (listado.length>0) {
        res.render('../views/main.hbs', { prods: listado, productsExists: true, user: userName, userStatus: true})
    } else {
        res.render('../views/main.hbs', { prods: listado, productsExists: false, user: userName , userStatus: true})
    }
})

/* FAKER ----------------------------------------------------------------------------------------- */
router.get('/productos-test', requireAuthentication, (req, res) => {
    let userName = req.session.passport.user.userEmail;
    res.render('../views/main.hbs', { prods: randomData, productsExists: true, user: userName , userStatus: true})
})

/* LOGIN ----------------------------------------------------------------------------------------- */
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/api/productos")
    }
    res.render('../views/partials/loginForm.hbs', { userStatus: false})
})

router.post('/login', passport.authenticate('login', {
    successRedirect: '/api/productos',
    failureRedirect: '/api/errorLogin',
    passReqToCallback: true
}))

/* router.post('/login', passport.authenticate('login', { successRedirect: '/api/productos', failureRedirect: '/api/errorLogin' }), (req, res) => {
    console.log('login', req.body);
    res.send(req.body);
}); */

router.get('/errorLogin', (req, res) => {
    res.render('../views/partials/errorLogin.hbs', { userStatus: false})
})

/* SIGN UP ----------------------------------------------------------------------------------------- */
router.get('/signup', (req, res) => {
    res.render('../views/partials/signUpForm.hbs', { userStatus: false})
})

router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/api/login',
    failureRedirect: '/api/errorSignUp',
    passReqToCallback: true
}));

/* router.post('/signup', passport.authenticate('signup', { successRedirect: '/api/login', failureRedirect: '/api/errorSignUp' }), (req, res) => {
    res.send(req.body);
}); */

router.get('/errorSignUp', (req, res) => {
    res.render('../views/partials/errorSignUp.hbs', { userStatus: false})
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