const { response } = require('express');
const Inmueble = require('../models/inmueble');
const usuario = require('../models/usuario');

const getInmuebles = async (req, res = response) => {

    const inmuebles = await Inmueble.find().
    populate('usuario', 'nombre img');

    res.json({
        ok: true,
        inmuebles
    })
}

const crearInmueble = async (req, res = response) => {

    const uid = req.uid;
    const inmueble = new Inmueble({

        usuario: uid,
        ...req.body
    });

    console.log(uid);

    try {

        const inmuebleDB = await inmueble.save();

        res.json({
            ok: true,
            inmueble: inmuebleDB
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }

}

const actualizarInmueble = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarInmueble'
    })
}

const borrarInmueble = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarInmueble'
    })
}

module.exports = {
    getInmuebles,
    crearInmueble,
    actualizarInmueble,
    borrarInmueble
}