import {Wallet, getDefaultProvider} from 'ethers'
import * as amp from './amp'
import keys from '../keys.json'
import {shuffleArray,reversePrice} from './utils/helpers'
import ws from './connection/wsclient'

const wallet = new Wallet(keys.AMPtaker)

const takeall = _ => {
  let orders = Object.values(amp.orderbook)
    .filter(ele=>ele.pairName==="AE/USDC")
    .filter(ele=>ele.status!="FILLED" && ele.status!="CANCELLED")

  console.log(orders)
}

Promise.all([amp.updateInfo(), amp.updatePairs(), amp.updateTokens()])
  .then( _ => amp.pairs.map(pair => amp.subscribe(pair)) )
  .then( arr => Promise.all(arr) )
  .then( takeall )
  .catch(msg => console.log({err: msg.toString()}))
  .then(_=>ws.close())
 


