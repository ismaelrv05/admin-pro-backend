const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyABsYBaudd4oVEs06axju6kHWZqhbazOss';

const faqPath = path.join(__dirname, '../embeddings/faq-embeddings.json');
const inmueblesEmbeddingPath = path.join(__dirname, '../embeddings/inmuebles-embeddings.json');

// función para generar embedding de la pregunta
async function generateEmbedding(text) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`;

    const body = {
        model: "models/embedding-001",
        content: {
            parts: [{ text }]
        }
    };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    if (data.embedding) {
        return data.embedding.values;
    } else {
        console.error("Error al generar embedding:", data);
        return null;
    }
}

// función cosine similarity
function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
}

//función principal
async function main() {
    const pregunta = process.argv.slice(2).join(' ');
    if (!pregunta) return console.log('Escribe una pregunta como argumento');

    console.log(`Procesando: "${pregunta}"`);

    const preguntaEmbedding = await generateEmbedding(pregunta);
    if (!preguntaEmbedding) return;

    // cargar FAQs
    const faqs = JSON.parse(fs.readFileSync(faqPath, 'utf-8')).map(faq => ({
        fuente: 'faq',
        texto: `${faq.pregunta}\nRespuesta: ${faq.respuesta}`,
        embedding: faq.embedding
    }));

    // cargar y vectorizar inmuebles
    const inmueblesEmbed = JSON.parse(fs.readFileSync(inmueblesEmbeddingPath, 'utf-8'));

    const baseConocimiento = [...faqs, ...inmueblesEmbed];

    // calcular similitud con todo
    const resultados = baseConocimiento.map(entry => ({
        ...entry,
        score: cosineSimilarity(preguntaEmbedding, entry.embedding)
    }));

    // ordenar por score
    const top = resultados.sort((a, b) => b.score - a.score).slice(0, 4);

    // generar contexto
    const contexto = top.map(e => `• ${e.texto.trim()}`).join('\n\n');

    const prompt = `
Eres un asesor inmobiliario experto.

A continuación tienes información útil (faq o inmuebles). Usa solo estos datos para responder al usuario:

${contexto}

---
Pregunta del usuario: ${pregunta}
Respuesta:
`;

    // llamar a Gemini para obtener respuesta final
    const respuesta = await callGemini(prompt);
    console.log('\nRespuesta del chatbot:\n');
    console.log(respuesta);
}

// llamada a Gemini
async function callGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }]
            }
        ]
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log('\nRespuesta RAW de Gemini:\n', JSON.stringify(data, null, 2));
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar respuesta.';
}


main();
