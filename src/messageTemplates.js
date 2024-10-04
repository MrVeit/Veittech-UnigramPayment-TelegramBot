const projectConsts = require('./projectConsts');

function getStartMessage(userName) 
{
    return `Good day, ${userName} 😎\n\nHere you can test the Unigram Payment library, ` +
    `which allows you to make payments via Telegram Stars, inside web applications made on Unity!`;
}

function getStartMessageButtons() 
{
    return {
        inline_keyboard: [
            [{ text: 'Launch 🎮', web_app: { url: projectConsts.UNITY_BUILD_HOST } }],
            [{ text: 'Documentation 📖', url: projectConsts.UNIGRAM_PAYMENT_REPO }],
            [{ text: 'Uniton Connect Library 📈', url: projectConsts.UNITON_CONNECT_REPO }]
        ]
    };
}

module.exports =
{
    getStartMessage,
    getStartMessageButtons
}