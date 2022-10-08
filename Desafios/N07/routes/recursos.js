import express from 'express';
const router = express.Router();

/* CHAT ----------------------------------------------------------------------------------------------. */
router.get('/chat', (req, res) => {
    res.render('../views/partials/chat.hbs')
})

/* PRODUCTOS ----------------------------------------------------------------------------------------- */
router.get('/productos', (req, res) => {
    res.render('../views/main.hbs')
})

export default router;