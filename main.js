const messageUtils = require('./messageUtils');
const timeUtility = require('./timeUtils');

const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

require('dotenv').config();

const server = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const port = process.env.PORT || 5000;

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
    console.log(`[${timeUtility.timestamp}] Failed to contact with bot, polling error:`, error.code, error.message);
});

bot.on('successful_payment', (message) => 
{
    const paymentInfo = message.successful_payment;

    console.log(`[${timeUtility.timestamp}] Successful payment:`, paymentInfo);

    axios.post(`${process.env.SERVER_DOMAIN}/api/process-payment`, paymentInfo)
        .then(response => 
        {
            console.log(`[${timeUtility.timestamp}] Payment info sent to server:`, response.data);
        })
        .catch(error => 
        {
            console.error(`[${timeUtility.timestamp}] Error sending payment info to server:`, error);
        });
});

bot.on('pre_checkout_query', async (query) => 
{
    const preCheckoutQueryId = query.id;
    
    await bot.answerPreCheckoutQuery(preCheckoutQueryId, true)
        .then(() => console.log(`[${timeUtility.timestamp}] Transaction status has been successfully received: ${query.order_info} from: ${query.from}`))
        .catch((errorMessage) => console.error(`[${timeUtility.timestamp}] Error answering PreCheckoutQuery callback with message:`, errorMessage));
});

server.listen(port, () => 
{
    console.log(`[${timeUtility.timestamp}] Server running at port: ${port}`);
});