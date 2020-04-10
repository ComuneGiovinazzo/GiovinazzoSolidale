
// Init
// ------------------------------------------------------------------------------- //
require('dotenv').config()
const dateFormat = require('dateformat')
const http = require('http')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/webhook', secret: process.env.SECRET })
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});
// ------------------------------------------------------------------------------- //




// Functions
// ------------------------------------------------------------------------------- //
function printMsg()
{
	var today = new Date();
	today.setHours(today.getHours() + 2);

	var msg = process.env.HTML_MSG;
	msg = msg.split("[NL]").join("\n");
	msg = msg.split("[TAB]").join("\t");
	msg = msg.replace('%_DATETIME_%',dateFormat(today, "yyyy-mm-dd H:MM:ss"));
	msg = msg.replace('%_DATE_%',dateFormat(today, "yyyy-mm-dd"));
	
	return msg;
}
// ------------------------------------------------------------------------------- //




// Http server
// ------------------------------------------------------------------------------- //
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end(process.env.HTML_404)
  })
}).listen(process.env.PORT)
// ------------------------------------------------------------------------------- //




// Telegram handler
// ------------------------------------------------------------------------------- //
handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
    if (event.payload.commits[0]['author']['name'] === 'ComuneGiovinazzo') {
	  bot.sendMessage(process.env.CHAT_ID, printMsg(), {parse_mode : "HTML"});
    }
})

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})
// ------------------------------------------------------------------------------- //