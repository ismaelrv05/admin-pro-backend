const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyABsYBaudd4oVEs06axju6kHWZqhbazOss';
const inmueblesPath = path.join(__dirname, '../data/inmuebles.json');
const outputPath = path.join(__dirname, '../embeddings/inmuebles-embeddings.json');

async function generateEmbedding(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`;

  const body = {
    model: "models/embedding-001",
    content: {
      parts: [{ text }]
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  return data.embedding?.values || null;
}

function extraerCiudad(direccion) {
  const partes = direccion.split(',');
  return partes.length > 1 ? partes[1].trim() : '';
}

async function main() {
  const inmuebles = JSON.parse(fs.readFileSync(inmueblesPath, 'utf-8'));
  const results = [];

  for (const inmueble of inmuebles) {
    const texto = `
[INMUEBLE]
ID: ${inmueble._id.$oid}
Nombre: ${inmueble.nombre}
Tipo: ${inmueble.tipo}
Precio: ${inmueble.precio} €
Ciudad: ${extraerCiudad(inmueble.ubicacion)}
Ubicación: ${inmueble.ubicacion}
Habitaciones: ${inmueble.habitaciones}
Baños: ${inmueble.banos}
Obra nueva: ${inmueble.obraNueva ? 'Sí' : 'No'}
Amueblado: ${inmueble.amueblado ? 'Sí' : 'No'}
Descripción: ${inmueble.descripcion}
[/INMUEBLE]
`.trim();

    const embedding = await generateEmbedding(texto);
    if (embedding) {
      results.push({
        texto,
        embedding
      });
      console.log(`Procesado: ${inmueble.nombre}`);
    } else {
      console.warn(`Falló: ${inmueble.nombre}`);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Guardado en: ${outputPath}`);
}

main();
