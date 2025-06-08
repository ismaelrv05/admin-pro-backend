const path = require('path');
const fs = require('fs');

const GEMINI_API_KEY = 'AIzaSyABsYBaudd4oVEs06axju6kHWZqhbazOss';

const faqPath = path.join(__dirname, '../data/faq.json');
const outputPath = path.join(__dirname, '../embeddings/faq-embeddings.json');

// función para llamar a Gemini y generar un embedding
async function generateEmbedding(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`;

  const body = {
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

  if (data.embedding) {
    return data.embedding.values;
  } else {
    console.error('Error al generar embedding:', data);
    return null;
  }
}

async function main() {
  // leer preguntas
  const faqs = JSON.parse(fs.readFileSync(faqPath, 'utf-8'));
  const results = [];

  for (const faq of faqs) {
    const texto = `${faq.pregunta} ${faq.respuesta}`;
    console.log(`Generando embedding para: ${faq.pregunta}`);

    const embedding = await generateEmbedding(texto);

    if (embedding) {
      results.push({
        id: faq.id,
        pregunta: faq.pregunta,
        respuesta: faq.respuesta,
        embedding
      });
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Embeddings guardados en: ${outputPath}`);
}

main();