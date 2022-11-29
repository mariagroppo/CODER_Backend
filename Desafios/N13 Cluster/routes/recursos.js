import express from 'express';
const router = express.Router();
import { randomData } from "../database/faker.js";
import passport from 'passport';
import "../passport/local-auth.js"

import ProductMongoDB from "../database/mongoDB/prodsMongoDB.js";
export const prodsMongo = new ProductMongoDB();

import MessageMongoDB from "../database/mongoDB/msgMongoDB.js";
import { userMongo } from '../database/mongoDB/userMongoDB.js';
export const msgsMongo = new MessageMongoDB();

/* middlewares -----------------------------------------------------------------------------------------] */

/* revisa si esta autenticado */
function requireAuthentication (req, res, next) {
    /* console.log("AUTENTICACION ------------------------------------------------")
    console.log(req.session.passport) */
    let a = req.isAuthenticated();
    /* console.log(a); */
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect("/api/login")
    }
}

/* PRODUCTOS ----------------------------------------------------------------------------------------- */
router.get('/productos', requireAuthentication, async (req, res) => {
    let idUser = req.session.passport.user;
    let userName = await userMongo.showUserName(idUser);
    let listado = await prodsMongo.getAll();
    if (listado.length>0) {
        res.render('../views/main.hbs', { prods: listado, productsExists: true, user: userName, userStatus: true})
    } else {
        res.render('../views/main.hbs', { prods: listado, productsExists: false, user: userName , userStatus: true})
    }
})

/* FAKER ----------------------------------------------------------------------------------------- */
router.get('/productos-test', requireAuthentication, async (req, res) => {
    let idUser = req.session.passport.user;
    let userName = await userMongo.showUserName(idUser);
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

router.get('/errorSignUp', (req, res) => {
    res.render('../views/partials/errorSignUp.hbs', { userStatus: false})
})

/* LOG OUT  ----------------------------------------------------------------------------------------- */
router.get('/logout', async (req, res) => {
    let idUser = req.session.passport.user;
    let userName = await userMongo.showUserName(idUser);
    try {
        console.log("Hasta luego " + userName);
        req.session.destroy();
        res.render('../views/main.hbs', { userStatus: false})
    } catch (error) {
		res.send('Error: ', error);
	}
    
});

import dotenv from "dotenv";
dotenv.config();
import {fork} from "child_process";
import {numCPUs} from "../server.js";

router.get('/info', requireAuthentication, async (req, res) => {
    let idUser = req.session.passport.user;
    let userName = await userMongo.showUserName(idUser);
    const data = {
        directorioActual: process.cwd(),
        idProceso: process.pid,
        vNode: process.version,
        rutaEjecutable: process.execPath,
        sistemaOperativo: process.platform,
        memoria: JSON.stringify(process.memoryUsage().rss, null, 2),
        title: process.title,
        procesadores: numCPUs
    }

    res.render('../views/partials/info.hbs', { userStatus: true, data: data, user: userName});
});

router.get(`/randoms`, requireAuthentication, async (req, res) => {
    let idUser = req.session.passport.user;
    let userName = await userMongo.showUserName(idUser);
    res.render(`../views/partials/random.hbs`, { userStatus: true, user: userName})
});

router.post(`/randoms`, requireAuthentication, async (req, res) => {
    let idUser = req.session.passport.user;
    let userName = await userMongo.showUserName(idUser);
    const { quantity } = req.body;
    process.env.CANTIDAD_RANDOM = quantity;

    const objectRandom = fork("./fork/randomNumbers.js");
    objectRandom.on(`message`, data => {
        /* return res.send(data); */
        res.render(`../views/partials/random.hbs`, { userStatus: true, user: userName, data: data})
    })
});

export default router;