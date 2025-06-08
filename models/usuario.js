const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE',
        required: true
    },
    google: {
        type: Boolean,
        default: false,
    },
    favoritos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Inmueble'
        }
    ],

});

UsuarioSchema.method('toJSON', function () {
    const { __V, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})



module.exports = model('Usuario', UsuarioSchema);