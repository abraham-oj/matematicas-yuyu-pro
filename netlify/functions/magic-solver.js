// netlify/functions/magic-solver.js

exports.handler = async function (event, context) {
    // 1. Configuración de CORS (para evitar bloqueos)
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Solo POST" };
    }

    try {
        const { problem, type } = JSON.parse(event.body);
        const API_KEY = process.env.HF_TOKEN;

        if (!API_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: "Falta la llave HF_TOKEN." }) };
        }

        // --- FASE 0: LIMPIEZA Y NORMALIZACIÓN ---
        // Quitamos acentos y pasamos a minúsculas para entender mejor
        // Ejemplo: "¿cuánto es él 20%?" -> "cuanto es el 20%"
        const cleanText = problem
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita tildes
            .replace(/[¿?¡!]/g, "") // Quita signos
            .trim();

        // --- FASE 1: CÁLCULO RÁPIDO (Solo si es aritmética pura) ---
        // Solo entramos aquí si NO hay letras (excepto x para multiplicar)
        // y si parece una cuenta directa "2+2"
        const isPureMath = /^[\d\.\+\-\*\/\(\)\s]+$/.test(cleanText.replace(/x/g, '*'));

        if (isPureMath) {
            try {
                const safeMath = cleanText.replace(/x/g, '*');
                // eslint-disable-next-line no-eval
                const result = eval(safeMath);

                if (!isNaN(result) && isFinite(result)) {
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            solution: `✨ **Cálculo Rápido:**\n\nEl resultado es:\n# **${result}**\n\n*(Calculado al instante ⚡)*`
                        })
                    };
                }
            } catch (e) {
                // Si falla, ignoramos y pasamos a la IA
            }
        }

        // --- FASE 2: LA INTELIGENCIA ARTIFICIAL (MISTRAL) ---

        // Prompt reforzado para entender lenguaje natural y errores
        const systemPrompt = `Eres "Profe Mágico", un tutor de matemáticas para niños de primaria.

        Tus Instrucciones Supremas:
        1. Tu alumna se llama Yuyu.
        2. Ella puede escribir con faltas de ortografía o sin acentos. ¡Entiéndela siempre!
        3. Si escribe texto (ej: "ayuda con x"), explícale el procedimiento.
        4. Si escribe una operación (ej: "2+2"), dale el resultado.
        5. Responde siempre en Español Latino, usando emojis 🌟.
        6. Usa formato Markdown (**negritas**) para resaltar la respuesta.
        `;

        const userPrompt = `<s>[INST] ${systemPrompt}

        La alumna pregunta: "${problem}" (Contexto: ${type}) [/INST]`;

        // Usamos la URL NUEVA de Hugging Face (Router)
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
                    parameters: {
                        max_new_tokens: 1024,
                        temperature: 0.6,
                        return_full_text: false
                    }
                }),
            }
        );

        const data = await response.json();

        // Manejo de errores de carga (503)
        if (data.error) {
            if (data.error.includes("loading")) {
                return {
                    statusCode: 503,
                    headers,
                    body: JSON.stringify({
                        error: `😴 El cerebro mágico se está despertando... espera unos segundos e intenta de nuevo.`
                    })
                };
            }
            throw new Error(data.error);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ solution: data[0].generated_text })
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Ups, hubo un error mágico: " + error.message })
        };
    }
};