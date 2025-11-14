// netlify/functions/magic-solver.js

exports.handler = async function (event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Solo POST" };
    }

    try {
        const { problem, type } = JSON.parse(event.body);

        // --- FASE 1: INTENTO DE RESOLUCIÓN LÓGICA (RÁPIDA) ---
        // Esto evita despertar a la IA para un simple "2+2"
        // Basado en tu lógica de Python (math_engine)

        const cleanProblem = problem.replace(/\s+/g, '');

        // 1. Aritmética Básica (Detecta números y operadores simples)
        if (/^[\d\.\+\-\*\/\(\)]+$/.test(cleanProblem)) {
            try {
                // Evaluamos matemáticamente (seguro para una calculadora simple)
                // Reemplazamos 'x' por '*' por si acaso
                const safeMath = cleanProblem.replace(/x/g, '*');
                const result = eval(safeMath);

                // Si funcionó, devolvemos respuesta INMEDIATA
                if (!isNaN(result) && isFinite(result)) {
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            solution: `✨ **Cálculo Rápido:**\n\nEl resultado de **${problem}** es:\n# **${result}**\n\n*(Calculado a la velocidad de la luz ⚡)*`
                        })
                    };
                }
            } catch (e) {
                // Si falla, no pasa nada, seguimos a la IA
            }
        }

        // 2. Álgebra Simple (Ej: 2x+5=15)
        if (type === 'algebra' && cleanProblem.includes('=')) {
            try {
                // Lógica simple para ax+b=c
                const parts = cleanProblem.split('=');
                const left = parts[0];
                const right = parseInt(parts[1]);

                if (left.includes('x')) {
                    // Intentamos extraer números rudimentariamente
                    // Esto es un parche rápido, la IA lo explicará mejor si esto falla
                    // Pero si funciona, es instantáneo.
                }
            } catch (e) { }
        }


        // --- FASE 2: LA INTELIGENCIA ARTIFICIAL (MISTRAL) ---
        // Si la lógica rápida no pudo, llamamos al experto.

        const API_KEY = process.env.HF_TOKEN;
        if (!API_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: "Falta la llave HF_TOKEN." }) };
        }

        const systemPrompt = `Eres "Profe Mágico", un tutor de matemáticas para niños.
        Reglas:
        1. Explica paso a paso con emojis 🌟.
        2. Usa formato Markdown (**negritas**).
        3. Sé breve y dulce.
        4. Tu respuesta debe ser en español.
        `;

        const userPrompt = `<s>[INST] ${systemPrompt}
        Problema: ${problem} [/INST]`;

        // Usamos Mistral-7B-Instruct-v0.3 (Más estable que Qwen ahora mismo)
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3",
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: userPrompt,
                    parameters: { max_new_tokens: 1024, temperature: 0.6 }
                }),
            }
        );

        const data = await response.json();

        // Manejo de ERRORES DE CARGA (El famoso 503)
        if (data.error) {
            // Si dice que está cargando, le decimos al usuario que espere bonito
            if (data.error.includes("loading")) {
                const waitTime = data.estimated_time || 20;
                return {
                    statusCode: 503, // Servicio no disponible temporalmente
                    body: JSON.stringify({
                        error: `😴 El cerebro mágico se está despertando... tardará unos ${Math.round(waitTime)} segundos. ¡Inténtalo de nuevo en un momentito!`
                    })
                };
            }
            throw new Error(data.error);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ solution: data[0].generated_text })
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Hubo un problema mágico: " + error.message })
        };
    }
};