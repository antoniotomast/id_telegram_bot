const { Configuration, OpenAIApi } = require('openai');

const chatGPT = async (ingredientes) => {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(config);
    const completion = await openai.createChatCompletion({
        model: 'gpt-4',
        max_tokens: 300,
        messages: [
            { role: 'assistant', content: 'Eres un bot de telegram. Tu tarea principal es generar recetas de cocina en función de los ingredientes que te pase el usuario' },
            { role: 'user', content: `Genera una receta en menos de 300 caracteres a partir de los siguientes ingredientes: ${ingredientes}` }
        ]
    });

    return completion.data.choices[0].message.content;
}

const chatGPTV2 = async (mensaje) => {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(config);
    const completion = await openai.createChatCompletion({
        model: 'gpt-4',
        max_tokens: 200,
        messages: [
            { role: 'assistant', content: 'Eres un bot de telegram. Tu nombre es @erFlemas. Debes responder como si fueses Darth Vader' },
            { role: 'user', content: `Responde de manera coherente y en menos de 200 caracteres al siguiente mensaje: ${mensaje}` }
        ]
    });

    return completion.data.choices[0].message.content;
}



module.exports = { chatGPT, chatGPTV2 };