import express from 'express'
import {Wallet, getDefaultProvider} from 'ethers'
import router from './routes'
import * as amp from './amp'
import msgCancelOrder from './messages/messageCancelOrder'
import msgNewOrder from './messages/messageNewOrder'
import keys from '../keys.json'


let provider = getDefaultProvider('rinkeby')
let wallet = new Wallet(keys.AMPmaker, provider)


let app = express()
app.use(express.static('public'))
app.use('/api', router)

Promise.all([amp.updateInfo(), amp.updatePairs()])
  .then( _ => amp.pairs.map( pair => amp.subscribe(pair)) )
  .then( subs => Promise.all(subs) )
  .catch(msg => {
    console.log('fail')
    console.log(msg.toString())
  })


/*
  }).then( _ => {
    app.listen(3001, () => console.log('App listening on port 3001'))
  }).catch( msg => {
    console.log(msg)
    process.exit()
  })
*/
