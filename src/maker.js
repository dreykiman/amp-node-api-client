import {Wallet, getDefaultProvider} from 'ethers'
import * as amp from './amp'
import {trader} from './trader'
import keys from '../keys.json'
import ws from './connection/wsclient'

const wallet = new Wallet(keys.AMPmaker)


/**
 * @function maker
 * @desc
 * 1. Initializes AMP pairs, tokens and info.
 * * Attempts to pull current orderbook for each pair
 * * Calculates an average price of the pair bids and asks based on previous step
 * * Enforces mininum spread
 * * Creates certain number of bids and asks with certain depth
 * * Creates new market orders and cancels old orders
 *    * special procedure to avoid empty market and new/old orders overlaps, i.e. buying from itself
 *    * separates orders by small delay [160, 240] msec to avoid ws server hammering
 */

ws.onopen = () => {
Promise.all([amp.updateInfo(), amp.updatePairs(), amp.updateTokens()])
  .then( _ => amp.pairs.map(pair => amp.subscribe(pair)) )
  .then( arr => Promise.all(arr) )
//  .then( _ => Promise.all(amp.sign(wallet).cancelall()))
  .then( _ => trader(wallet).makeall(amp.pairs.slice(0,20)))
  .catch(msg => console.log({err: msg}))
  .then(_=>ws.close())
}


