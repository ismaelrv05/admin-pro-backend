/*
    ruta: api/all/busqueda
*/
const { Router } = require('express');
const { getAll, getColectionDoc } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:busqueda', validarJWT, getAll);
router.get('/colection/:table/:busqueda', validarJWT, getColectionDoc);

module.exports = router;
