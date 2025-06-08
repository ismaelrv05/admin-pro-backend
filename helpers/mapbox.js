const axios = require('axios');

const geocodeDireccion = async (direccion) => {
  const token = process.env.MAPBOX_TOKEN;
  const encodedAddress = encodeURIComponent(direccion);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}`;

  const resp = await axios.get(url);

  if (!resp.data.features.length) {
    throw new Error('No se encontraron coordenadas para la dirección');
  }

  const [lng, lat] = resp.data.features[0].center;
  return { lat, lng };
};

module.exports = { geocodeDireccion };
