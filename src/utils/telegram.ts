import TelegramBot from 'node-telegram-bot-api'

export const sendMessage = async (messageData: string) => {
    const telegramToken = process.env.TELEGRAM_TOKEN
    const chatId = process.env.CHAT_ID
    const token: string = telegramToken;
    const bot = new TelegramBot(token)

    const message: string = messageData;

    try {
        bot.sendMessage(chatId, message)
    } catch (error) {
        console.error("Error Sending Message", error)
    }
}