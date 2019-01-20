import {Wallet, getDefaultProvider} from 'ethers'
import rp from 'request-promise-native'
import * as amp from './amp'
import {trader} from './trader'
import keys from '../keys.json'
import {connectWS} from './connection/wsclient'
import {getconfig} from './datastore/firedata'

const confname = process.argv.find(ele=>ele==='rinkeby') || 'default'

let wallet = new Wallet(keys.AMPtaker)
if (confname==='rinkeby')
  wallet = new Wallet(keys.rinkebyAMPtaker)

/**
 * @function taker
 * @desc
 * * Randomly decides to buy or sell WETH/USDC pair.
 * * Pulls the cheapest (most expensive) existing order and buys (sells) from it.
 */

getconfig(confname)
  .then( ({wsaddress, ampurl, gasMax}) => Promise.resolve()
    .then( _ => rp('https://ethgasstation.info/json/ethgasAPI.json', {json:true}))
    .then( ({average}) => {
      average /= 10
      return average>gasMax ? Promise.reject(`gas price: ${average}>${gasMax}`) : Promise.resolve()
    }).then( _ => connectWS(wsaddress) )
    .then( _ => Promise.all([amp.updateInfo(ampurl), amp.updatePairs(ampurl), amp.updateTokens(ampurl)]) )
  ).then( _ => amp.pairs.map(pair => amp.subscribe(pair)) )
  .then( arr => Promise.all(arr) )
  // find if valid pairName was passed as argument
  .then( _ => amp.pairs.find(({pairName}) => process.argv.includes(pairName)) || {pairName: 'WETH/USDC'} )
  .then( ({pairName}) => trader(wallet).takeone(pairName) )
  .catch(msg => console.log({err: JSON.stringify(msg), src: 'taker.js'}))
  .then(_=>process.exit())

