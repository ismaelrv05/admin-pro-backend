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

const actualizarInmueble = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const inmueble = await Inmueble.findById(id);
        if (!inmueble) {
            return res.status(404).json({
                ok: true,
                msg: 'El inmueble no existe'
            });
        }

        const cambiosInmueble = { 
            ...req.body,
            usuario: uid
        }

        const inmuebleActualizado = await Inmueble.findByIdAndUpdate( id, cambiosInmueble, { new: true });

        res.json({
            ok: true,
            inmueble : inmuebleActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

    const borrarInmueble = async (req, res = response) => {
        const id = req.params.id;
    
        try {
            const inmueble = await Inmueble.findById(id);
            if (!inmueble) {
                return res.status(404).json({
                    ok: true,
                    msg: 'El inmueble no existe'
                });
            }
    
            await Inmueble.findByIdAndDelete( id );
    
            res.json({
                ok: true,
                msg: 'Inmueble eliminado'
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado... revisar logs'
            })
        }
    }

    module.exports = {
        getInmuebles,
        crearInmueble,
        actualizarInmueble,
        borrarInmueble
    }