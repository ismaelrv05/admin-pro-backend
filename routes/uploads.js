/*
    ruta: api/upload/
*/
const { Router } = require('express');
const expressfileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const { uploadFiles, returnImage } = require('../controllers/uploads');

const router = Router();

router.use(expressfileUpload());
router.put('/:tipo/:id', validarJWT, uploadFiles);
router.get('/:tipo/:image', returnImage);

module.exports = router;
