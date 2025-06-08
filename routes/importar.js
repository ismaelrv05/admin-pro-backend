const { Router } = require('express');
const { importarInmueblesCSV } = require('../controllers/importar');
const expressFileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(expressFileUpload());
router.post('/csv', validarJWT, importarInmueblesCSV);

module.exports = router;
