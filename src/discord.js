import rp from 'request-promise-native'
import { spawn } from 'child_process'
import Discord from 'discord.io'
import auth from '../auth.json'
import WebSocket from 'ws'
import msgTrades from './messages/messageTrades'


// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
})


bot.on('ready', evt  => {
  console.log("connected")
})


bot.on('message', (user, userID, to, message, evt) => {
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1)

    switch(cmd) {
      case 'take':
        console.log(cmd)
        const taker = spawn( 'node', ['dist/taker', ...args] )
        taker.stdout.on( 'data', msg => bot.sendMessage({to, message: '`'+msg+'`'}) )
        taker.on( 'close', _ => bot.sendMessage({to, message: ''}) )
        break;
      case 'make':
        console.log(cmd)
        const maker = spawn( 'node', ['dist/maker'] )
        maker.stdout.on( 'data', msg => bot.sendMessage({to, message: '`'+msg+'`'}) )
        maker.on( 'close', _ => bot.sendMessage({to, message: '================'}) )
        break;
      case 'help':
        bot.sendMessage({to, message: '`!make - makes market, really long output of errors occurred during market making (e.g. not found pairs on cryptocompare, insufficient balance etc`'})
        bot.sendMessage({to, message: '`!take [pairName, e.g. DAI/USDC] - takes specified pair (or WETH/USDC by default)`'})
        break;
    }

//    if (cmd in commands) commands[cmd](user, userID, channelID, args)
//    else commands.help(user, userID, channelID, args)
  }
})


