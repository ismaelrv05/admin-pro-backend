const { response } = require('express');
const Inmueble = require('../models/inmueble');
const Usuario = require('../models/usuario');
const { geocodeDireccion } = require('../helpers/mapbox');

const getInmuebles = async (req, res = response) => {
    try {
        const inmuebles = await Inmueble.find()
            .populate('usuario', 'nombre img');

        res.json({
            ok: true,
            inmuebles
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los inmuebles'
        });
    }
};

const getInmuebleById = async (req, res = response) => {
    const id = req.params.id;

    try {
        const inmueble = await Inmueble.findById(id)
            .populate('usuario', 'nombre img');

        if (!inmueble) {
            return res.status(404).json({
                ok: false,
                msg: 'Inmueble no encontrado'
            });
        }

        res.json({
            ok: true,
            inmueble
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el inmueble'
        });
    }
};

const getInmueblesRecientes = async (req, res = response) => {
    try {
      const inmuebles = await Inmueble.find()
        .populate('usuario', 'nombre img')
        .sort({ fechaPublicacion: -1 })
        .limit(20); 
  
      res.json({
        ok: true,
        inmuebles
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al obtener los inmuebles recientes'
      });
    }
  };
  
  const crearInmueble = async (req, res = response) => {
    const uid = req.uid;
    const { ubicacion } = req.body;
  
    try {
      // Geocodificacion Mapbox
      const { lat, lng } = await geocodeDireccion(ubicacion);
  
      const inmueble = new Inmueble({
        ...req.body,
        coordenadas: { 
          type: 'Point',
          coordinates: [lng, lat]
        },
        usuario: uid
      });
  
      const inmuebleDB = await inmueble.save();
  
      res.json({
        ok: true,
        inmueble: inmuebleDB
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al crear inmueble (verifica la dirección)'
      });
    }
  };

const actualizarInmueble = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const inmueble = await Inmueble.findById(id);
        if (!inmueble) {
            return res.status(404).json({
                ok: false,
                msg: 'El inmueble no existe'
            });
        }

        const cambiosInmueble = {
            ...req.body,
            usuario: uid
        };

        const inmuebleActualizado = await Inmueble.findByIdAndUpdate(id, cambiosInmueble, { new: true });

        res.json({
            ok: true,
            inmueble: inmuebleActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar inmueble'
        });
    }
};

const borrarInmueble = async (req, res = response) => {
    const id = req.params.id;

    try {
        const inmueble = await Inmueble.findById(id);
        if (!inmueble) {
            return res.status(404).json({
                ok: false,
                msg: 'El inmueble no existe'
            });
        }

        await Inmueble.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Inmueble eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar inmueble'
        });
    }
};

module.exports = {
    getInmuebles,
    getInmuebleById,
    getInmueblesRecientes,
    crearInmueble,
    actualizarInmueble,
    borrarInmueble
};
