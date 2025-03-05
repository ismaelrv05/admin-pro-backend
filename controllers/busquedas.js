const { response } = require('express');
const Usuario = require('../models/usuario');
const Inmueble = require('../models/inmueble');


const getAll = async (req, res = response) => {

    const busqueda = req.params.busqueda;
    const expreg = new RegExp(busqueda, 'i');

    const [usuarios, inmuebles] = await Promise.all([
        Usuario.find({ nombre: expreg }),
        Inmueble.find({ nombre: expreg }),

    ]);

    res.json({
        ok: true,
        usuarios,
        inmuebles,

    })

}

const getColectionDoc = async (req, res = response) => {

    const table = req.params.table;
    const busqueda = req.params.busqueda;
    const expreg = new RegExp(busqueda, 'i');

    let data = [];

    switch (table) {
        case 'inmuebles':
            data = await Inmueble.find({ nombre: expreg })
                .populate('usuario', 'nombre img');

            break;

        case 'usuarios':
            data = await Usuario.find({ nombre: expreg })

            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'Invalid collection'
            });
    }

    res.json({
        ok: true,
        resultados: data
    })


    const [usuarios, inmuebles] = await Promise.all([
        Usuario.find({ nombre: expreg }),
        Inmueble.find({ nombre: expreg }),

    ]);

}

module.exports = {
    getAll,
    getColectionDoc
}