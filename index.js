const express = require('express');
const { Telegraf } = require('telegraf');
const { chatGPT, chatGPTV2 } = require('./utils');
const axios = require('axios').default;
const googleTTS = require('google-tts-api');

const User = require('./models/user.model');

//Config .env
require('dotenv').config();

// Config DB
require('./config/db');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// Config Telegraf
app.use(bot.webhookCallback('/telegram-bot'));
bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`);

app.post('/telegram-bot', (req, res) => {
    res.send('Hola everyone');
});

// MIDDLEWARE
bot.use(async (ctx, next) => {
    ctx.from.telegram_id = ctx.from.id;

    const user = await User.findOne({ telegram_id: ctx.from.id });
    if (!user) await User.create(ctx.from);


    next();
});

// COMANDOS
bot.command('test', async (ctx) => {
    console.log(ctx.message);
    await ctx.reply(`Hola ${ctx.from.first_name}`);
    await ctx.replyWithDice();
});


bot.command('tiempo', async (ctx) => {

    try {
        const ciudad = ctx.message.text.slice(8);

        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${process.env.OWM_API_KEY}&units=metric`);

        await ctx.reply(
            `El tiempo en ${ciudad}: 
    Temperatura: ${data.main.temp} grados
    Máxima: ${data.main.temp_max}
    Mínima ${data.main.temp_min}
    Humedad ${data.main.humidity}%`
        );
        await ctx.replyWithLocation(data.coord.lat, data.coord.lon);
    } catch (error) {
        ctx.reply('No se encuentra la ciudad especificada');
    }


});

bot.command('receta', async (ctx) => {
    const receta = ctx.message.text.slice(8);
    const response = await chatGPT(receta);
    ctx.reply(response);
});

bot.command('chat', async ctx => {
    // chat hola amigui
    const mensaje = ctx.message.text.slice(6);

    const count = await User.countDocuments();
    const randomNum = Math.floor(Math.random() * count);
    const user = await User.findOne().skip(randomNum);

    bot.telegram.sendMessage(user.telegram_id, mensaje);
    ctx.reply(`Mensaje enviado a ${user.first_name}`);
});

// Eventos
bot.on('text', async ctx => {
    // const response = await chatGPTV2(ctx.message.text);
    const response = ctx.message.text;

    const url = googleTTS.getAudioUrl(response, {
        lang: 'es', slow: false, host: 'https://translate.google.com'
    });

    await ctx.reply(response);
    await ctx.replyWithAudio(url);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});