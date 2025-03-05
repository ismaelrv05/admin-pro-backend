const { Schema, model } = require('mongoose');

const InmuebleSchema = Schema({

    nombre: {
        type: String,
        required: true
    },

    img:{
        type: String,
    },

    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, { collection: 'inmuebles' });

InmuebleSchema.method('toJSON', function(){
    const {__v, ...object } = this.toObject();
    return object; 
})



module.exports = model( 'Inmueble', InmuebleSchema );