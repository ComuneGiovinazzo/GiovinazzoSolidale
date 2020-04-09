require('dotenv').config()
const http = require('http')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/webhook', secret: process.env.SECRET })

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

http.createServer(function (req, res) {
  if (req.method === 'GET' && req.url === '/test') {
    console.log("test ok 3");
  }
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(process.env.PORT)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
    bot.sendMessage(process.env.CHAT_ID, 'I dati sono stati aggiornati');
})

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})
