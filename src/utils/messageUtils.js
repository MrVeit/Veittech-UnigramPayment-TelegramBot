const messageTemplates = require('../messageTemplates');
const time = require('./timeUtils');

function generateUserData(message) 
{
    const names = `${message.from.first_name} ${message.from.last_name || ''}`;

    var userData = 
    {
        userId: message.from.id,
        chatId: message.chat.id,
        names: names.trim()
    }

    return userData;
}

function sendStartMessage(bot, userData) 
{
    let replyMarkup = messageTemplates.getStartMessageButtons();

    sendMessageWithInlineButtons(bot, userData.userId, 
        messageTemplates.getStartMessage(userData.names), replyMarkup);

    console.log(`[${time.getCurrentTimestamp()}] Sended start message for user: ${userData.names}`);
}

function sendMessageWithInlineButtons(bot, chatId, text, replyMarkup) 
{
    bot.sendMessage(chatId, text,
    {
        reply_markup: replyMarkup 
    })
    .catch(error =>
    {
        console.error(`[${time.getCurrentTimestamp()}] Failed to send message: ${error}`)
    });
}

module.exports = 
{ 
    sendStartMessage,
    sendMessageWithInlineButtons,
    generateUserData 
};