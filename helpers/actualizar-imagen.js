const fs = require('fs');

const Usuario = require('../models/usuario');
const Inmueble = require('../models/inmueble');

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        //borrar la imagen anterior
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {

    let pathAnterior = '';

    switch (tipo) {
        case 'usuarios':
            const usuario = await Usuario.findByIdAndUpdate(id);
            if (!usuario) {
                console.error('No existe un usuario con ese id');
                return false;
            }

            pathAnterior = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathAnterior);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

            break;

        case 'inmueble':

            const inmueble = await Inmueble.findByIdAndUpdate(id);
            if (!inmueble) {
                console.error('No existe un inmueble con ese id');
                return false;
            }

            pathAnteriorInm = `./uploads/inmuebles/${inmueble.img}`;
            borrarImagen(pathAnteriorInm);

            inmueble.img = nombreArchivo;
            await inmueble.save();
            return true;

            break;

        default:
            console.error('Tipo de colección no válida');
    }


}


module.exports = {
    actualizarImagen
}