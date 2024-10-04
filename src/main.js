const messageUtils = require('./utils/messageUtils');
const time = require('./utils/timeUtils');

const express = require('express');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto-js');

const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();

const server = express();
const port = process.env.PORT || 5000;

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

server.use(express.static(path.join(__dirname, 'TelegramBot-UnigramPayment')));
server.use(express.json());

function init(message, match) 
{
    const userData = messageUtils.generateUserData(message);

    messageUtils.sendStartMessage(bot, userData);
}

bot.onText(/\/start(?:\s+(.+))?/i, (message, match) => 
{
    init(message, match);
});

bot.on('polling_error', (error) => 
{
    console.log(`[${time.getCurrentTimestamp()}] Failed to contact with bot, polling error:`, error.code, error.message);
});

bot.on('successful_payment', (message) => 
{
    const paymentInfo = message.successful_payment;

    console.log(`[${time.getCurrentTimestamp()}] Successful payment:`, paymentInfo);

    const encryptedToken = crypto.AES.encrypt(
        process.env.BOT_TOKEN, process.env.AUTHORIZATION_SECRET_KEY);

    axios.post(`${process.env.SERVER_DOMAIN}/api/payment/update-order-receipt`, paymentInfo,
    { 
        headers: 
        { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${encryptedToken}`
        }
    })
    .then(response => 
    {
        console.log(`[${time.getCurrentTimestamp()}] Payment info sent to server:`, response.data);
    })
    .catch(error => 
    {
        console.error(`[${time.getCurrentTimestamp()}] Error sending payment info to server:`, error);
    });
});

bot.on('pre_checkout_query', async (query) => 
{
    const preCheckoutQueryId = query.id;
    
    await bot.answerPreCheckoutQuery(preCheckoutQueryId, true)
        .then(() => 
        {
            console.log(`[${time.getCurrentTimestamp()}] Transaction status has been successfully received: ${query.invoice_payload} from: ${query.from.username}`)
        })
        .catch((errorMessage) =>
        {
            console.error(`[${time.getCurrentTimestamp()}] Error answering PreCheckoutQuery callback with message:`, errorMessage)
        });
});

server.listen(port, () => 
{
    console.log(`[${time.getCurrentTimestamp()}] Unigram Payment Bot running at port: ${port}`);
});