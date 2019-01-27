import {Wallet, getDefaultProvider} from 'ethers'
import * as amp from './amp'
import {trader} from './trader'
import keys from '../keys.json'
import {startWSclient} from './connection/wsclient'
import {getconfig} from './datastore/firedata'
import {delay} from './utils/helpers'

const confname = process.argv.find(ele=>ele==='rinkeby') || 'default'

let wallet = new Wallet(keys.AMPmaker)
if (confname==='rinkeby')
  wallet = new Wallet(keys.rinkebyAMPmaker)

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

let config = getconfig(confname)

config
  .then( ({wsaddress, ampurl}) => startWSclient(wsaddress).then( _=> ampurl ))
  .then( ampurl => Promise.all([amp.updateInfo(ampurl), amp.updatePairs(ampurl), amp.updateTokens(ampurl)]) )
  .then( _ => amp.pairs.map(pair => delay(Math.random()*5000).then(_=>amp.subscribe(pair))) )
  .then( arr => Promise.all(arr) )
//  .then( _ => Promise.all(amp.sign(wallet).cancelall()))
  .then( _ => config )
  .then( ({whitelist}) => amp.pairs.filter(pair => whitelist==undefined || whitelist.includes(pair.baseTokenSymbol)) )
  .then( pairs => trader(wallet).makeall(pairs.slice(0,20)))
  .catch(msg => console.log({err: msg}))
  .then(_=>process.exit())

