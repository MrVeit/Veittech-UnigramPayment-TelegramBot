const messageTemplates = require('./messageTemplates');
const timeUtility = require('./timeUtils');

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

    sendMessageWithInlineButtons(bot, userData.userId, messageTemplates.getStartMessage(userData.names), replyMarkup);

    console.log(`[${timeUtility.timestamp}] Sended start message for user: ${userData.names}`);
}

function sendMessageWithInlineButtons(bot, chatId, text, replyMarkup) 
{
    bot.sendMessage(chatId, text, { reply_markup: replyMarkup })
        .catch(error => console.error(`[${timeUtility.timestamp}] Failed to send message: ${error}`));
}

module.exports = 
{ 
    sendStartMessage,
    sendMessageWithInlineButtons,
    generateUserData 
};