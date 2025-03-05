/*
    Inmuebles 
    ruta: '/api/inmuebles'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');


const { 
    getInmuebles,
    crearInmueble,
    actualizarInmueble,
    borrarInmueble
} = require('../controllers/inmuebles');

const router = Router();

router.get('/', getInmuebles);

router.post('/',

    [
        validarJWT,
        check('nombre', 'El nombre del inmueble es necesario').not().isEmpty(),
        validarCampos
    ],

    crearInmueble);

router.put( '/:id',

    [

    ],
    actualizarInmueble);

router.delete('/:id',
    borrarInmueble
);


module.exports = router;

