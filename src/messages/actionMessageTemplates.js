function getStartMessage(userName) 
{
    return `Good day, ${userName} 😎\n\nHere you can test the Unigram Payment library, ` +
    `which allows you to make payments via Telegram Stars, inside web applications made on Unity!`;
}

function getSuccessPurchaseMessage(
    username, payloadId, starsAmount)
{
    return `Wow, ${username}, u have successfully `+
        `purchased the item ${payloadId} for ${starsAmount}🌟`;
}

module.exports =
{
    getStartMessage,
    getSuccessPurchaseMessage,
}