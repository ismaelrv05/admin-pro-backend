const fs = require('fs');
const csv = require('csv-parser');
const Inmueble = require('../models/inmueble');
const { geocodeDireccion } = require('../helpers/mapbox');

const importarInmueblesCSV = async (req, res) => {
  if (!req.files || !req.files.csv) {
    return res.status(400).json({ ok: false, msg: 'No se subió ningún archivo CSV' });
  }

  const file = req.files.csv;
  const tempPath = `./uploads/${file.name}`;
  await file.mv(tempPath);

  const resultados = [];

  fs.createReadStream(tempPath)
    .pipe(csv())
    .on('data', (data) => resultados.push(data))
    .on('end', async () => {
      try {
        const inmuebles = [];

        for (const row of resultados) {
          let coordenadas = {
            type: 'Point',
            coordinates: [0, 0] // fallback
          };

          try {
            const { lat, lng } = await geocodeDireccion(row.ubicacion);
            coordenadas.coordinates = [lng, lat];
          } catch (err) {
            console.warn(`No se pudo geocodificar: ${row.ubicacion}`);
          }

          inmuebles.push({
            nombre: row.nombre,
            descripcion: row.descripcion || '',
            precio: parseFloat(row.precio),
            ubicacion: row.ubicacion,
            coordenadas,
            tipo: row.tipo,
            disponibilidad: row.disponibilidad,
            obraNueva: row.obraNueva === 'true',
            metrosCuadrados: parseInt(row.metrosCuadrados),
            habitaciones: parseInt(row.habitaciones),
            banos: parseInt(row.banos),
            garage: row.garage === 'true',
            amueblado: row.amueblado === 'true',
            fechaPublicacion: new Date(row.fechaPublicacion),
            img: row.img || '',
            usuario: req.uid
          });
        }

        await Inmueble.insertMany(inmuebles);
        fs.unlinkSync(tempPath);

        res.json({
          ok: true,
          msg: 'Importación completada',
          cantidad: inmuebles.length
        });

      } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al importar los inmuebles' });
      }
    });
};

module.exports = {
  importarInmueblesCSV
};
