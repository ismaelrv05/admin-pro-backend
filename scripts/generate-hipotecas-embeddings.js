const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyABsYBaudd4oVEs06axju6kHWZqhbazOss';
const hipotecasPath = path.join(__dirname, '../data/hipotecas.json');
const outputPath = path.join(__dirname, '../embeddings/hipotecas-embeddings.json');

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

async function main() {
    const hipotecas = JSON.parse(fs.readFileSync(hipotecasPath, 'utf-8'));
    const results = [];

    for (const h of hipotecas) {
        const texto = `
[HIPOTECA]
Entidad: ${h.entidad}
Tipo: ${h.tipo}
TAE: ${h.tae}
Cuota estimada: ${h.cuota} €
Plazo: ${h.plazo}
Requisitos: ${h.requisitos}
Comentarios: ${h.comentarios}
[/HIPOTECA]
`.trim();

        const embedding = await generateEmbedding(texto);
        if (embedding) {
            results.push({
                texto,
                embedding
            });
            console.log(`Procesado texto:\n`, texto.slice(0, 80), '...');
        } else {
            console.warn(`Falló: ${h.nombre}`);
        }
    }

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Guardado en: ${outputPath}`);
}

main();
