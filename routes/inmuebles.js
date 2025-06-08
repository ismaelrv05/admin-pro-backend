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
    getInmuebleById,
    crearInmueble,
    actualizarInmueble,
    borrarInmueble,
    getInmueblesRecientes
} = require('../controllers/inmuebles');

const router = Router();

router.get('/', getInmuebles);
router.get('/recientes', getInmueblesRecientes);
router.get('/:id', getInmuebleById);


router.post('/',

    [
        validarJWT,
        check('nombre', 'El nombre del inmueble es necesario').not().isEmpty(),
        validarCampos
    ],

    crearInmueble);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre del inmueble es necesario').not().isEmpty(),
        validarCampos,
    ],
    actualizarInmueble);

router.delete('/:id',
    validarJWT,
    borrarInmueble
);


module.exports = router;

