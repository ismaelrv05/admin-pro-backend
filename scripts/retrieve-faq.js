const fs = require('fs');
const path = require('path');

// 👇 Tu clave de Gemini
const GEMINI_API_KEY = 'AIzaSyABsYBaudd4oVEs06axju6kHWZqhbazOss';

// Archivos
const embeddingPath = path.join(__dirname, '../embeddings/faq-embeddings.json');

// Función para generar embedding de la pregunta del usuario
async function generateEmbedding(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`;
  const body = { content: { parts: [{ text }] } };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (data.embedding) {
    return data.embedding.values;
  } else {
    console.error('Error:', data);
    return null;
  }
}

// Función para calcular cosine similarity
function cosineSimilarity(a, b) {
  const dot = a.reduce((acc, val, i) => acc + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
  return dot / (normA * normB);
}

// Función principal
async function main() {
  const pregunta = process.argv.slice(2).join(' ');
  if (!pregunta) return console.log('Escribe una pregunta como argumento');

  const userEmbedding = await generateEmbedding(pregunta);
  if (!userEmbedding) return;

  const faqEmbeddings = JSON.parse(fs.readFileSync(embeddingPath, 'utf-8'));

  // Calcular similitud con cada FAQ
  const resultados = faqEmbeddings.map(faq => {
    const sim = cosineSimilarity(userEmbedding, faq.embedding);
    return { ...faq, score: sim };
  });

  // Ordenar por similitud y tomar top 3
  const top = resultados.sort((a, b) => b.score - a.score).slice(0, 3);

  console.log(`Pregunta: ${pregunta}`);
  console.log('Resultados más parecidos:\n');
  top.forEach((r, i) => {
    console.log(`#${i + 1} (${(r.score * 100).toFixed(2)}%)`);
    console.log(`Pregunta: ${r.pregunta}`);
    console.log(`Respuesta: ${r.respuesta}\n`);
  });
}

main();
