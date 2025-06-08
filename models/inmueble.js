const { Schema, model } = require('mongoose');

const InmuebleSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
  },
  precio: {
    type: Number,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  coordenadas: {                               
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  tipo: {
    type: String,
    enum: ['Casa', 'Departamento', 'Terreno', 'Local', 'Piso', 'Chalet', 'Estudio', 'Ático', 'Casa Rural', 'Dúplex'],
    required: true
  },
  disponibilidad: {
    type: String,
    enum: ['compra', 'alquiler'],
    required: true
  },
  obraNueva: {
    type: Boolean,
    default: false
  },
  metrosCuadrados: {
    type: Number
  },
  habitaciones: {
    type: Number
  },
  banos: {
    type: Number
  },
  garage: {
    type: Boolean,
    default: false
  },
  amueblado: {
    type: Boolean,
    default: false
  },
  fechaPublicacion: {
    type: Date,
    default: Date.now
  },
  img: {
    type: String,
  },
  usuario: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, { collection: 'inmuebles' });

InmuebleSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model('Inmueble', InmuebleSchema);
