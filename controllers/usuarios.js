const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const Inmueble = require('../models/inmueble');


const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;
    console.log(desde);

    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),

        Usuario.countDocuments()
    ]);


    res.json({
        ok: true,
        usuarios,
        total
    });

}

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        // Guardar usuario
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


}


const actualizarUsuario = async (req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }


}

const getFavoritos = async (req, res) => {
    const uid = req.uid;

    try {
        const usuario = await Usuario.findById(uid).populate('favoritos', 'nombre img');
        res.json({ ok: true, favoritos: usuario.favoritos });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al obtener favoritos' });
    }
};

const addFavorito = async (req, res) => {
    const uid = req.uid;
    const inmuebleId = req.params.inmuebleId;

    try {
        console.log('ID recibido:', inmuebleId);
        const usuario = await Usuario.findById(uid);
        console.log('Favoritos actuales antes de añadir:', usuario.favoritos);

        const yaExiste = usuario.favoritos.some(id => id.toString() === inmuebleId);

        if (!yaExiste) {
            usuario.favoritos.push(inmuebleId);
            await usuario.save();
            console.log('Nuevo favorito añadido');
        }

        console.log('Favoritos después de añadir:', usuario.favoritos);

        res.json({ ok: true, msg: 'Inmueble añadido a favoritos' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al añadir favorito' });
    }
};


const removeFavorito = async (req, res) => {
    const uid = req.uid;
    const inmuebleId = req.params.inmuebleId;

    try {
        const usuario = await Usuario.findById(uid);
        usuario.favoritos = usuario.favoritos.filter(id => id.toString() !== inmuebleId);
        await usuario.save();

        res.json({ ok: true, msg: 'Inmueble eliminado de favoritos' });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al eliminar favorito' });
    }
};

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
    getFavoritos,
    addFavorito,
    removeFavorito
}