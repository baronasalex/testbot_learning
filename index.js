const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')
const token = '5776854096:AAFwiaSgw34ajv_2esTB7NwLrjd3_jdGaSM'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 0 до 9, а ты должен будешь его отгадать)!`)
    const randomNumber = Math.floor(Math.random() * 10)       
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Я загадал, отгадывай!)', gameOptions)
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Это начальное приветствие!'},
        {command: '/info', description: 'Информация о пользователе!'},
        {command: '/game', description: 'Игра, угадай число!'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/7e8/aa6/7e8aa67b-ad91-4d61-8f62-301bde115989/192/3.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот!`)
        } 
       
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        
        if(text === '/game'){
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Попробуй еще раз, я тебя не понимаю')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }

        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю! Ты отгадал цифру: ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не отгадал, бот загадал цифру ${chats[chatId]} ! Попробуй еще раз! `, againOptions)
        }
    })
}

start()    


