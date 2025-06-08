const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const faqPath = path.join(__dirname, '../embeddings/faq-embeddings.json');
const inmueblesPath = path.join(__dirname, '../embeddings/inmuebles-embeddings.json');
const hipotecasPath = path.join(__dirname, '../embeddings/hipotecas-embeddings.json');


router.post('/', async (req, res) => {
  const { pregunta, contextoInmueble, historial = [] } = req.body;

  if (!pregunta) return res.status(400).json({ error: 'Falta la pregunta' });

  try {
    const preguntaEmbedding = await generateEmbedding(pregunta);

    const faqs = JSON.parse(fs.readFileSync(faqPath, 'utf-8')).map(faq => ({
      fuente: 'faq',
      texto: `${faq.pregunta}\nRespuesta: ${faq.respuesta}`,
      embedding: faq.embedding
    }));

    const inmuebles = JSON.parse(fs.readFileSync(inmueblesPath, 'utf-8'));
    const hipotecas = JSON.parse(fs.readFileSync(hipotecasPath, 'utf-8')).map(h => ({
      fuente: 'hipoteca',
      texto: h.texto,
      embedding: h.embedding
    }));


    const baseConocimiento = [...faqs, ...inmuebles, ...hipotecas];

    const resultados = baseConocimiento.map(entry => ({
      ...entry,
      score: cosineSimilarity(preguntaEmbedding, entry.embedding)
    }));

    const top = resultados.sort((a, b) => b.score - a.score).slice(0, 8);

    const contexto = top.map(e => `• ${e.texto.trim()}`).join('\n\n');
    const contextoExtra = contextoInmueble
      ? `\n\n[Contexto inmueble seleccionado]\nNombre: ${contextoInmueble.nombre}\nPrecio: ${contextoInmueble.precio} €\n\n`
      : '';
    const historialTexto = historial.map(m =>
      `${m.esUsuario ? 'Usuario' : 'Asistente'}: ${m.texto}`
    ).join('\n');


    const prompt = `

    ${contextoExtra}
    Historial de la conversación hasta ahora:
    ${historialTexto}

Eres un asesor inmobiliario profesional. Tu función es ayudar al usuario a encontrar inmuebles relevantes según su consulta.

Solo puedes usar la información proporcionada en el contexto. 
No inventes datos y no menciones inmuebles que no estén presentes. 
Tampoco hagas afirmaciones generales sin basarte en el contexto.

El usuario puede hacer preguntas en lenguaje natural como:
• “Busco una casa de 2 habitaciones en Sevilla”
• “¿Tienes pisos en alquiler por menos de 500€?”
• “Muéstrame inmuebles cerca del centro de Valencia con garaje”

Debes interpretar su intención y compararla con los inmuebles listados.

---

**Cómo están estructurados los datos en el contexto**:

- **ID**: se encuentra como ID: abc123... y debe usarse para construir el enlace del inmueble.
- **Ubicación**: contiene dirección y ciudad. El **nombre de la ciudad aparece tras la coma**. Ejemplo:  
  "Ubicación: Calle Mayor 12, Madrid" → Ciudad = "Madrid"
- **Ciudad**: Nombre de la ciudad extraído de la ubicación. Normalmente el usuario busca por ciudad. Ejemplo: "Piso de dos habitaciones en Sevilla" → Ciudad = "Sevilla"
- **Precio**: "Precio: 215000 €" es un número entero seguido de €
- **Habitaciones**: "Habitaciones: 2" representa el número de dormitorios
- **Baños**: "Baños: 1" representa el número de baños
- **Tipo**: "Tipo: Piso" o "Tipo: Casa" define el tipo de inmueble
- **Descripción**: puede contener frases clave útiles como “amueblado”, “con trastero”, “obra nueva”, “cerca del centro”, etc.

---

**Instrucciones para responder**:

1. Busca coincidencias exactas según los criterios del usuario (ej. ciudad + habitaciones).
2. Si no hay coincidencia perfecta, ofrece alternativas similares, explicando que no es exacto pero puede interesarle.
3. **Nunca digas** "no tengo resultados". Siempre muestra al menos 1-3 inmuebles útiles si existen.

---

**Formato de respuesta**:

Comienza con una frase clara y útil. Luego, muestra hasta 4 inmuebles como lista usando el siguiente formato:

• 🏷️ Tipo: ...
• 📍 Ubicación: ...
• 🛏️ Habitaciones: ...
• 🛁 Baños: ...
• 💰 Precio: ...
• 📝 Descripción: ...
• 🔗 Enlace: http://localhost:4200/home/inmueble/ID_DEL_INMUEBLE

Donde ID_DEL_INMUEBLE es el identificador del inmueble.

--- HIPOTECAS ---

Cuando el usuario consulta inmuebles y después te pregunta por una hipoteca para uno de ellos, actúa así:

1. Identifica el precio del inmueble consultado anteriormente.
2. Si no tienes información del sueldo del usuario, pídeselo de forma amable.
3. Con el sueldo mensual del usuario y el precio del inmueble, presenta las opciones de hipotecas de las proporcionadas en el contexto.
4. Usa el contexto proporcionado (con diferentes hipotecas) para encontrar la mejor opción según:
   - Cuota más baja
   - Plazo aceptable (máximo 30 años)
   - Que el ratio cuota/sueldo no supere el 35%

Los datos de las hipotecas están incluidos en el contexto con el siguiente formato:

[HIPOTECA]
Entidad: Nombre del banco
Tipo: Fija o Variable
TAE: porcentaje anual equivalente
Cuota estimada: cantidad en euros (mensual)
Plazo: duración del préstamo (ej. 30 años)
Requisitos: condiciones que deben cumplirse
Comentarios: observaciones adicionales como importe base o condiciones de simulación
[/HIPOTECA]

Debes extraer directamente los valores desde estos bloques [HIPOTECA] del contexto para seleccionar una o dos opciones óptimas.

Para seleccionar las mejores opciones, prioriza:
- Hipotecas cuya **cuota estimada sea más baja**.
- Plazos no superiores a 30 años.
- Que el **ratio cuota/sueldo mensual** sea ≤ 35%.

Calcula el ratio con esta fórmula: (cuota estimada / sueldo mensual) * 100

Presenta entre 1 y 2 hipotecas adecuadas en este formato:

🏦 Banco: [entidad]  
📈 Tipo: [tipo]  
💳 Cuota estimada: [importe]  
📊 TAE: [tae]  
🧾 Requisitos: [requisitos]  
✅ Ratio de endeudamiento: X% → [apto/no apto]. Recuerda que el ratio debe ser menor o igual al 35% para considerarlo apto y se calcula como (cuota estimada / sueldo mensual) * 100.

No inventes datos. Usa exclusivamente los bloques del contexto y asegúrate de copiar correctamente los valores extraídos.

---

Información adicional enviada desde el frontend:

Si el usuario ya ha seleccionado un inmueble, se incluirá un objeto llamado contextoInmueble con los siguientes datos:

- nombre: nombre o dirección del inmueble
- precio: precio del inmueble

Si contextoInmueble está presente, debes usar su información directamente **sin volver a preguntar por el precio del inmueble**. Solo pregunta por el sueldo mensual del usuario si aún no se conoce.


A continuación tienes información útil (faq, inmuebles o hipotecas). Usa solo estos datos para responder al usuario:

${contexto}

---
Pregunta del usuario: ${pregunta}
Respuesta:
`;

    const respuesta = await callGemini(prompt);

    return res.json({ respuesta });
  } catch (error) {
    console.error('Error en /api/chatbot:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;

// FUNCIONES AUXILIARES
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
  return data.embedding?.values || null;
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

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
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar respuesta.';
}