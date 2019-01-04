import {Wallet, getDefaultProvider} from 'ethers'
import * as amp from './amp'
import {trader} from './trader'
import keys from '../keys.json'
import ws from './connection/wsclient'

const wallet = new Wallet(keys.AMPtaker)

/**
 * @function taker
 * @desc
 * * Randomly decides to buy or sell WETH/USDC pair.
 * * Pulls the cheapest (most expensive) existing order and buys (sells) from it.
 */
Promise.all([amp.updateInfo(), amp.updatePairs(), amp.updateTokens()])
  .then( _ => amp.pairs.map(pair => amp.subscribe(pair)) )
  .then( arr => Promise.all(arr) )
  .then( _ => trader(wallet).takeone(process.argv[2]||"WETH/USDC") )
  .catch(msg => console.log({err: JSON.stringify(msg), src: 'taker.js'}))
  .then(_=>ws.close())
 


