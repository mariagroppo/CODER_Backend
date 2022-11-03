/* https://www.youtube.com/watch?v=uVltgEcjNww */
import passport from 'passport';
import { Strategy } from 'passport-local';
import { User } from "../database/mongoDB/models/userModel.js";
import {userMongo} from "../database/mongoDB/userMongoDB.js";

/* PASSPORT --------------------------------------------------------------------------------------- */
/* signup es como se llama el método de autenticación
Recibe 1ro un objeto de configuración (lo que recibimos del cliente) y dedspués un callback de ejecución
passReqToCallback: true hace que se pueda recibir el req en el callback de ejecución
done es un callback que se usa para devolverle una rta al cliente
 */
passport.use('signup', new Strategy({usernameField: 'userEmail', passwordField: 'inputPassword', passReqToCallback:true}, async (req, userEmail, inputPassword, done) => {
    try {
        /* PRIMERO VERIFICO QUE EL CORREO NO ESTE REGISTRADO */
        let userName = req.body.userName;
        if (await userMongo.verifyEmail(userEmail)) {
            console.log('El usuario ya existe');
            return done(null, false);
            /* return done(null, false, req.flash('signUpMessage', true)); */
        } else {
            let user = await userMongo.save(userEmail, inputPassword, userName);
            /* await userMongo.updateId();
            user = await userMongo.showUser(userEmail);
            console.log(await userMongo.getAll()); */
            console.log("Nuevo usuario creado");
            return done(null, user);
        }
        
    } catch (error) {
        console.log(error);
    }
    
}))

/* Se guarda el usuario internamente en el navegador para que no tenga que autenticarse constantemente */
/* Cada vez que el usuario va a otra página devuelve el id */
passport.serializeUser((user, done) => {
    /* console.log("serializa")
    console.log(user._id.toString()); */
    done(null, user._id.toString());
});

/* Recibe id almacenado y hace el proceso inverso */
passport.deserializeUser(async (_id, done) => {
    /* console.log("deserializa")
    console.log(_id) */
    const user = await User.findById(_id);
    /* console.log(user); */
    done(null, user);
});



passport.use('login', new Strategy({usernameField: 'userEmail', passwordField: 'inputPassword', passReqToCallback: true}, async (req, userEmail, inputPassword, done) => {
    try {
        /* PRIMERO VERIFICO QUE EL CORREO ESTE REGISTRADO */
        if (await userMongo.verifyEmail(userEmail)) {
            // console.log("El usuario esta OK.")
            let user = await User.findOne({email: userEmail});
            if (user.validatePassword(inputPassword)) {
                // console.log("La pwd es correcta");
                return done(null, user);
            } else {
                console.log("La pwd es incorrecta.");
                return done(null, false);
                /* return done(null, false, req.flash('loginPassMessage', true)); */
            }
        } else {
            return done(null, false);
            /* return done(null, false, req.flash('loginUserMessage', true)); */
        }
        
    } catch (error) {
        console.log(error);
    }   
}));
